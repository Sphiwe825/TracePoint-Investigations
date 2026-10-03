namespace TracePointApi.models
{
    public class Investigation
    {
        public int InvestigationId { set; get; }
        public int CaseId { set; get; }
        public int SuspectId { set; get; }
        public string Conclusion { set; get; } = string.Empty;
        public DateTime DateStarted { set; get; }
    }
}
