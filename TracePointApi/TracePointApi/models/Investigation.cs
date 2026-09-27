namespace TracePointApi.models
{
    public class Investigation
    {
        public int InvestigationId { set; get; }
        public int CaseId { set; get; } = new Case().CaseId;
        public int SuspectId { set; get; } = new Suspect().SuspectId;
        public string Conclusion { set; get; }
        public DateTime DateStarted { set; get; } = DateTime.UtcNow;
    }
}
