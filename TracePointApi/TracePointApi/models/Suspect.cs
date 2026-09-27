namespace TracePointApi.models
{
    public class Suspect
    {
        public int SuspectId { set; get; }
        public string Name { set; get; }
        public string Occupation { set; get; }
        public string Description { set; get; }
        public DateTime CreatedAt { set; get; } = DateTime.UtcNow;
        public DateTime UpdatedAt { set; get; } = DateTime.UtcNow;
    }
}
