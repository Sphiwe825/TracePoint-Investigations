namespace TracePointApi.models
{
    public class Suspect
    {
        public int SuspectId { set; get; }
        public string Name { set; get; } = string.Empty;
        public string Occupation { set; get; } = string.Empty;
        public string Description { set; get; } = string.Empty;
    }
}
