using backend.DTO;
using backend.Models;
using backend.Settings;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class ServiceEntriesServices
    {
        private readonly IMongoCollection<ServiceEntriesSchema> serviceEntriesSchema;

        public ServiceEntriesServices(IOptions<DatabaseSettings> dbSettings)
        {
            MongoClient mongo = new MongoClient(dbSettings.Value.ConnectionString);
            serviceEntriesSchema = mongo.GetDatabase(dbSettings.Value.DatabaseName).GetCollection<ServiceEntriesSchema>(dbSettings.Value.ServiceEntriesCollection);
        }

        public async Task CreateService(string serviceName, string fileKey)
        {
            ServiceEntriesSchema service = new ServiceEntriesSchema();

            service.ServiceName = serviceName;
            service.OriginalFileKey = fileKey;
            service.CreatedAt = DateTime.UtcNow;
            service.CreatedBy = "tanay.kumar@gmail.com";

            await serviceEntriesSchema.InsertOneAsync(service);
        }

        public async Task<ServiceEntriesSchema> GetSetvice(string serviceId)
        {
            var service = await serviceEntriesSchema.Find(sr => sr.Id == serviceId).FirstOrDefaultAsync();
            return service;
        }
    }
}
