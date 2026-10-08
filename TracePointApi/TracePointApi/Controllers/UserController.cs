using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Net;
using TracePointApi.models;

namespace TracePointApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<UserController> _logger;

        public UserController(IConfiguration configuration, ILogger<UserController> logger)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("Connection String not found");
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT userId, username, email, createdAt FROM users ORDER BY userId;";
                var users = await connection.QueryAsync<User>(sql);
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load users from the database");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to load users." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT userId, username, email, createdAt FROM users WHERE userId = @id;";
                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { id });

                if (user == null)
                {
                    return NotFound("User not found");
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch user by id {UserId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to fetch user." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            if (string.IsNullOrWhiteSpace(user.Username) ||
                string.IsNullOrWhiteSpace(user.Email) ||
                string.IsNullOrWhiteSpace(user.Password))
            {
                return BadRequest("Username, email, and password are required.");
            }

            try
            {
                await using var connection = new MySqlConnection(connectionString);

                var existingUser = await connection.QueryFirstOrDefaultAsync<User>(
                    "SELECT userId, username, email FROM users WHERE username = @Username OR email = @Email LIMIT 1;",
                    new { user.Username, user.Email });

                if (existingUser != null)
                {
                    return Conflict("Username or email is already registered.");
                }

                const string sql = @"
                    INSERT INTO users (username, email, password)
                    VALUES (@Username, @Email, @Password);
                    SELECT LAST_INSERT_ID();";
                var userId = await connection.ExecuteScalarAsync<int>(sql, user);

                return Ok(new
                {
                    success = true,
                    message = "User created successfully",
                    userId,
                    user.Username,
                    user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create user record");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to create user." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest("Invalid login data.");
            }

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = @"
                    SELECT userId, username, email, password
                    FROM users
                    WHERE email = @Email
                    LIMIT 1;";
                var user = await connection.QueryFirstOrDefaultAsync<User>(sql, new { request.Email });

                if (user == null || user.Password != request.Password)
                {
                    return Unauthorized(new { message = "Invalid email or password." });
                }

                return Ok(new
                {
                    success = true,
                    message = "Login successful.",
                    userId = user.UserId,
                    username = user.Username,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to log in a user");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to login at this time." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] User user)
        {
            if (user == null)
            {
                return BadRequest("Invalid user data.");
            }

            var columnsToUpdate = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(user.Username))
            {
                columnsToUpdate.Add("username = @Username");
                parameters.Add("Username", user.Username);
            }

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                columnsToUpdate.Add("email = @Email");
                parameters.Add("Email", user.Email);
            }

            if (!string.IsNullOrWhiteSpace(user.Password))
            {
                columnsToUpdate.Add("password = @Password");
                parameters.Add("Password", user.Password);
            }

            if (!columnsToUpdate.Any())
            {
                return BadRequest("No valid fields were provided for the update.");
            }

            parameters.Add("id", id);

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                var sql = $"UPDATE users SET {string.Join(", ", columnsToUpdate)} WHERE userId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, parameters);

                if (rowsAffected < 1)
                {
                    return NotFound($"User with id {id} was not found.");
                }

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update user record {UserId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to update user." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "DELETE FROM users WHERE userId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, new { id });

                if (rowsAffected < 1)
                {
                    return NotFound($"User with id {id} was not found.");
                }

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete user record {UserId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to delete user." });
            }
        }
    }
}
