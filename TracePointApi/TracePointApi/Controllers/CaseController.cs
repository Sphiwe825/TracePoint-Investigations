using Microsoft.AspNetCore.Mvc;
using TracePointApi.models;
using Dapper;
using MySqlConnector;
using System.Net;

namespace TracePointApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CaseController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<CaseController> _logger;
        public CaseController(IConfiguration configuration, ILogger<CaseController> logger)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("Connection String not found");
            _logger = logger;
        }

        // GET: api/<CaseController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cases>>> GetAllCases()
        {
            try
            {
                using var connection = new MySqlConnection(connectionString);
                string sql = "SELECT * FROM cases;";
                var cases = await connection.QueryAsync<Cases>(sql);
                return Ok(cases);
            }catch(Exception e)
            {
                _logger.LogError(e, "Failed to load cases from the database");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "" });
            }
        }

        // GET api/<CaseController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCaseById(int id)
        {
            using var connection = new MySqlConnection(connectionString);
            string sql = "SELECT * FROM cases where caseId = @id";
            var caseReturned = await connection.QueryFirstOrDefaultAsync<Cases>(sql, new { id });
            if (caseReturned == null)
            {
                return NotFound("Case not found");
            }
            return Ok(caseReturned);
        }

        // POST api/<CaseController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Cases cases)
        {
            using var connection = new MySqlConnection(connectionString);
            string sql = "INSERT INTO cases (casename, description, status) values (@CaseName, @Description, @Status)";
            await connection.ExecuteAsync(sql, cases);
            return Ok(new { message = "New Case created" });
        }

        // PUT api/<CaseController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Cases cases)
        {
            if (cases == null)
            {
                return BadRequest("Invalid case data.");
            }

            using var connection = new MySqlConnection(connectionString);
            var columnsToUpdate = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(cases.CaseName))
            {
                columnsToUpdate.Add("casename = @CaseName");
                parameters.Add("CaseName", cases.CaseName);
            }

            if (!string.IsNullOrEmpty(cases.Description))
            {
                columnsToUpdate.Add("description = @Description");
                parameters.Add("Description", cases.Description); 
            }

            if (!string.IsNullOrEmpty(cases.Status))
            {
                columnsToUpdate.Add("status = @Status");
                parameters.Add("Status", cases.Status);
            }

            if (!columnsToUpdate.Any())
            {
                return BadRequest("No valid fields were provided for the update.");
            }

            parameters.Add("id", id);

            string sql = $@"UPDATE cases SET {string.Join(", ", columnsToUpdate)} WHERE caseId = @id;";
            int rowsAffected = await connection.ExecuteAsync(sql, parameters);

            if (rowsAffected < 1)
            {
                return NotFound($"Case with id {id} is not found.");
            }

            return Ok(new { message = "Case updated Successfully" });
        }

        // DELETE api/<CaseController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            using var connection = new MySqlConnection(connectionString);
            string sql = "DELETE FROM cases WHERE caseId = @id;";

            int rowsAffected = await connection.ExecuteAsync(sql, new { id });

            if (rowsAffected < 1)
            {
                return NotFound($"Case with id {id} not found.");
            }

            return Ok(new { message = "Case deleted successfully" });
        }
    }
}
