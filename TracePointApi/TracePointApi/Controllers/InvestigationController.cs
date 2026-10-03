using Dapper;
using Microsoft.AspNetCore.Mvc;
using MySqlConnector;
using System.Net;
using TracePointApi.models;

namespace TracePointApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvestigationController : ControllerBase
    {
        private readonly string connectionString;
        private readonly ILogger<InvestigationController> _logger;

        public InvestigationController(IConfiguration configuration, ILogger<InvestigationController> logger)
        {
            connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentNullException("Connection String not found");
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Investigation>>> GetAllInvestigations()
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM investigations ORDER BY investigationId;";
                var investigations = await connection.QueryAsync<Investigation>(sql);
                return Ok(investigations);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load investigations from the database");
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to load investigations." });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInvestigationById(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "SELECT * FROM investigations WHERE investigationId = @id;";
                var investigation = await connection.QueryFirstOrDefaultAsync<Investigation>(sql, new { id });

                if (investigation == null)
                {
                    return NotFound("Investigation not found");
                }

                return Ok(investigation);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to fetch investigation by id {InvestigationId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to fetch investigation." });
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Investigation investigation)
        {
            if (investigation == null)
            {
                return BadRequest(new { message = "Invalid investigation data." });
            }

            if (investigation.CaseId <= 0 || investigation.SuspectId <= 0 || string.IsNullOrWhiteSpace(investigation.Conclusion))
            {
                return BadRequest(new { message = "Case, suspect, and conclusion are required." });
            }

            try
            {
                const string sql = @"
                    INSERT INTO investigations (caseid, suspectid, conclusion)
                    VALUES (@CaseId, @SuspectId, @Conclusion);
                    SELECT LAST_INSERT_ID();";

                await using var connection = new MySqlConnection(connectionString);
                var investigationId = await connection.ExecuteScalarAsync<int>(sql, investigation);

                return Ok(new
                {
                    success = true,
                    message = "Investigation submitted successfully",
                    investigationId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create investigation record for case {CaseId} and suspect {SuspectId}", investigation.CaseId, investigation.SuspectId);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to create investigation." });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Investigation investigation)
        {
            if (investigation == null)
            {
                return BadRequest(new { message = "Invalid investigation data." });
            }

            var columnsToUpdate = new List<string>();
            var parameters = new DynamicParameters();

            if (investigation.CaseId > 0)
            {
                columnsToUpdate.Add("caseId = @CaseId");
                parameters.Add("CaseId", investigation.CaseId);
            }

            if (investigation.SuspectId > 0)
            {
                columnsToUpdate.Add("suspectId = @SuspectId");
                parameters.Add("SuspectId", investigation.SuspectId);
            }

            if (!string.IsNullOrWhiteSpace(investigation.Conclusion))
            {
                columnsToUpdate.Add("conclusion = @Conclusion");
                parameters.Add("Conclusion", investigation.Conclusion);
            }

            if (!columnsToUpdate.Any())
            {
                return BadRequest(new { message = "No valid fields were provided for the update." });
            }

            parameters.Add("id", id);

            try
            {
                await using var connection = new MySqlConnection(connectionString);
                var sql = $"UPDATE investigations SET {string.Join(", ", columnsToUpdate)} WHERE investigationId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, parameters);

                if (rowsAffected < 1)
                {
                    return NotFound($"Investigation with id {id} was not found.");
                }

                return Ok(new { message = "Investigation updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update investigation record {InvestigationId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to update investigation." });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await using var connection = new MySqlConnection(connectionString);
                const string sql = "DELETE FROM investigations WHERE investigationId = @id;";
                var rowsAffected = await connection.ExecuteAsync(sql, new { id });

                if (rowsAffected < 1)
                {
                    return NotFound($"Investigation with id {id} was not found.");
                }

                return Ok(new { message = "Investigation deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to delete investigation record {InvestigationId}", id);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { error = "Unable to delete investigation." });
            }
        }
    }
}