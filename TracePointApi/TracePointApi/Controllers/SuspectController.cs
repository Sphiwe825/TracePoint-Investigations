using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Net;
using TracePointApi.models;

namespace TracePointApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuspectController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<SuspectController> _logger;

        public SuspectController(IConfiguration configuration, ILogger<SuspectController> logger)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("Connection String not found");
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Suspect>>> GetAllSuspects()
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM suspect ORDER BY suspectId;";
                var suspects = await connection.QueryAsync<Suspect>(sql);
                return Ok(suspects);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load suspects from the database");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to load suspects." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetSuspectById(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM suspect WHERE suspectId = @id;";
                var suspect = await connection.QueryFirstOrDefaultAsync<Suspect>(sql, new { id });

                if (suspect == null)
                {
                    return NotFound("Suspect not found");
                }

                return Ok(suspect);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch suspect by id {SuspectId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to fetch suspect." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Suspect suspect)
        {
            if (suspect == null)
            {
                return BadRequest("Invalid suspect data.");
            }

            if (string.IsNullOrWhiteSpace(suspect.Name) ||
                string.IsNullOrWhiteSpace(suspect.Occupation) ||
                string.IsNullOrWhiteSpace(suspect.Description))
            {
                return BadRequest("Name, occupation, and description are required.");
            }

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "INSERT INTO suspect (name, occupation, description) VALUES (@Name, @Occupation, @Description);";
                await connection.ExecuteAsync(sql, suspect);
                return Ok(new { message = "Suspect created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create suspect record");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to create suspect." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Suspect suspect)
        {
            if (suspect == null)
            {
                return BadRequest("Invalid suspect data.");
            }

            var columnsToUpdate = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(suspect.Name))
            {
                columnsToUpdate.Add("name = @Name");
                parameters.Add("Name", suspect.Name);
            }

            if (!string.IsNullOrWhiteSpace(suspect.Occupation))
            {
                columnsToUpdate.Add("occupation = @Occupation");
                parameters.Add("Occupation", suspect.Occupation);
            }

            if (!string.IsNullOrWhiteSpace(suspect.Description))
            {
                columnsToUpdate.Add("description = @Description");
                parameters.Add("Description", suspect.Description);
            }

            if (!columnsToUpdate.Any())
            {
                return BadRequest("No valid fields were provided for the update.");
            }

            parameters.Add("id", id);

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                var sql = $"UPDATE suspect SET {string.Join(", ", columnsToUpdate)} WHERE suspectId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, parameters);

                if (rowsAffected < 1)
                {
                    return NotFound($"Suspect with id {id} was not found.");
                }

                return Ok(new { message = "Suspect updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update suspect record {SuspectId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to update suspect." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "DELETE FROM suspect WHERE suspectId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, new { id });

                if (rowsAffected < 1)
                {
                    return NotFound($"Suspect with id {id} was not found.");
                }

                return Ok(new { message = "Suspect deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete suspect record {SuspectId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to delete suspect." });
            }
        }
    }
}
