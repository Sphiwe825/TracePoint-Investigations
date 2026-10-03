using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Net;
using TracePointApi.models;

namespace TracePointApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EvidenceController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<EvidenceController> _logger;

        public EvidenceController(IConfiguration configuration, ILogger<EvidenceController> logger)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("Connection String not found");
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Evidences>>> GetAllEvidence()
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM evidence ORDER BY evidenceId;";
                var evidence = await connection.QueryAsync<Evidences>(sql);
                return Ok(evidence);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load evidence from the database");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to load evidence." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvidenceById(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM evidence WHERE evidenceId = @id;";
                var evidence = await connection.QueryFirstOrDefaultAsync<Evidences>(sql, new { id });

                if (evidence == null)
                {
                    return NotFound("Evidence not found");
                }

                return Ok(evidence);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch evidence by id {EvidenceId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to fetch evidence." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Evidences evidence)
        {
            if (evidence == null)
            {
                return BadRequest("Invalid evidence data.");
            }

            if (string.IsNullOrWhiteSpace(evidence.Title) ||
                string.IsNullOrWhiteSpace(evidence.Description) ||
                string.IsNullOrWhiteSpace(evidence.Location))
            {
                return BadRequest("Title, description, and location are required.");
            }

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "INSERT INTO evidence (title, description, location) VALUES (@Title, @Description, @Location);";
                await connection.ExecuteAsync(sql, evidence);
                return Ok(new { message = "Evidence created successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create evidence record");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to create evidence." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody] Evidences evidence)
        {
            if (evidence == null)
            {
                return BadRequest("Invalid evidence data.");
            }

            var columnsToUpdate = new List<string>();
            var parameters = new DynamicParameters();

            if (!string.IsNullOrWhiteSpace(evidence.Title))
            {
                columnsToUpdate.Add("title = @Title");
                parameters.Add("Title", evidence.Title);
            }

            if (!string.IsNullOrWhiteSpace(evidence.Description))
            {
                columnsToUpdate.Add("description = @Description");
                parameters.Add("Description", evidence.Description);
            }

            if (!string.IsNullOrWhiteSpace(evidence.Location))
            {
                columnsToUpdate.Add("location = @Location");
                parameters.Add("Location", evidence.Location);
            }

            if (!columnsToUpdate.Any())
            {
                return BadRequest("No valid fields were provided for the update.");
            }

            parameters.Add("id", id);

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                var sql = $"UPDATE evidence SET {string.Join(", ", columnsToUpdate)} WHERE evidenceId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, parameters);

                if (rowsAffected < 1)
                {
                    return NotFound($"Evidence with id {id} was not found.");
                }

                return Ok(new { message = "Evidence updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update evidence record {EvidenceId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to update evidence." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "DELETE FROM evidence WHERE evidenceId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, new { id });

                if (rowsAffected < 1)
                {
                    return NotFound($"Evidence with id {id} was not found.");
                }

                return Ok(new { message = "Evidence deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete evidence record {EvidenceId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to delete evidence." });
            }
        }
    }
}
