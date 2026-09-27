namespace TracePointApi.models
{
    public class Case
    {
        public int CaseId { set; get; }
        public string CaseName { set; get; }
        public string Description { set; get; }
        public string Status { set; get; }
        public DateTime CreatedAt { set; get; } = DateTime.UtcNow;
        public DateTime UpdatedAt { set; get; } = DateTime.UtcNow;
    }
}
