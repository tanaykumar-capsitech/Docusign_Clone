using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class ServiceEntriesSchema
    {
        [BsonId]
        [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
        public string? Id { get; set; }
        public string ServiceName { get; set; }
        public string OriginalFileKey { get; set; }
        public string? SignedFileKey { get; set; }
        public string? RecipientEmail { get; set; }
        public DocumentStatus Status { get; set; } = DocumentStatus.Draft;
        public string CreatedBy { get; set; }
        public SignatureField? SignatureField { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class SignatureField
    {
        public int Page { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public enum DocumentStatus
    {
        Draft,
        Sent,
        Signed,
        Approved
    }
}
