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

        public async Task<List<ServiceEntriesSchema>> GetAllSetvice()
        {
            var service = await serviceEntriesSchema.Find(all => true).ToListAsync();
            return service;
        }

        public async Task<ServiceEntriesSchema> GetSetvice(string serviceId)
        {
            var service = await serviceEntriesSchema.Find(sr => sr.Id == serviceId).FirstOrDefaultAsync();
            return service;
        }

        public async Task UpdateSignFieldDetails(string serviceId, List<SignatureField> signFields)
        {
            var filter = Builders<ServiceEntriesSchema>.Filter.Eq(sr => sr.Id, serviceId);
            var update = Builders<ServiceEntriesSchema>.Update.Set(sr => sr.SignatureField, signFields);

            await serviceEntriesSchema.UpdateOneAsync(filter, update);
        }

        public async Task<ServiceEntriesSchema> UpdateSign(SignatureUpdateDTO dto)
        {
            var filter = Builders<ServiceEntriesSchema>.Filter.Eq(sr => sr.Id, dto.ServiceId);
            var update = Builders<ServiceEntriesSchema>.Update.Set(sr => sr.RecipientSignature, dto.Signature).Set(sr => sr.Status, DocumentStatus.Signed);

            await serviceEntriesSchema.UpdateOneAsync(filter, update);
            return await serviceEntriesSchema.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpdateSignedPdfPath(string id,  string updatedPublicKey)
        {
            var filter = Builders<ServiceEntriesSchema>.Filter.Eq(sr => sr.Id, id);
            var update = Builders<ServiceEntriesSchema>.Update.Set(sr => sr.SignedFileKey, updatedPublicKey);

            await serviceEntriesSchema.UpdateOneAsync(filter, update);
        }
    }
}
