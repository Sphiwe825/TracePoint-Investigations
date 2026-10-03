namespace TracePointApi.models
{
    public class Cases
    {
        public int CaseId { set; get; }
        public string CaseName { set; get; } = string.Empty;
        public string Description { set; get; } = string.Empty;
        public string Status { set; get; } = string.Empty;
    }
}
