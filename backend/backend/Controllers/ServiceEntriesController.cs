using backend.DTO;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class ServiceEntriesController : ControllerBase
    {
        private readonly ServiceEntriesServices serviceEntriesServices;
        private readonly CloudinaryServices cloudinaryServices;

        public ServiceEntriesController(ServiceEntriesServices serviceEntriesServices, CloudinaryServices cloudinaryServices)
        {
            this.serviceEntriesServices = serviceEntriesServices;
            this.cloudinaryServices = cloudinaryServices;
        }

        [HttpPost("CreateService")]
        public async Task CreateService([FromForm]ServiceEntriesCreationDTO dto)
        {
            string filekey = await cloudinaryServices.UploadFile(dto.Document);
            await serviceEntriesServices.CreateService(dto.ServiceName, filekey);
        }


        [HttpGet("GetAllServices")]
        public async Task<List<ServiceEntriesSchema>> GetAllServiceDetails()
        {
            var service = await serviceEntriesServices.GetAllSetvice();

            foreach (var item in service)
            { 
                item.OriginalFileKey = cloudinaryServices.GetFileUrl(item.OriginalFileKey);
            }

            return service;
        } 


        [HttpGet("GetService")]
        public async Task<ServiceEntriesSchema> GetServiceDetails(string serviceId)
        {
            var service = await serviceEntriesServices.GetSetvice(serviceId);

            service.OriginalFileKey = cloudinaryServices.GetFileUrl(service.OriginalFileKey);

            return service;
        } 
    }
}
