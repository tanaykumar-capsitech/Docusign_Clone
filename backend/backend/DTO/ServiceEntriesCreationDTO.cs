using backend.Models;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.DTO
{
    public class ServiceEntriesCreationDTO
    {
        public string ServiceName { get; set; }
        public IFormFile Document { get; set; } 
    }
}
