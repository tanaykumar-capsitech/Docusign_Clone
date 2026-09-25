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
        private readonly EmailService emailService;

        public ServiceEntriesController(ServiceEntriesServices serviceEntriesServices, CloudinaryServices cloudinaryServices, EmailService emailService)
        {
            this.serviceEntriesServices = serviceEntriesServices;
            this.cloudinaryServices = cloudinaryServices;
            this.emailService = emailService;
        }

        [HttpPost("CreateService")]
        public async Task CreateService([FromForm]ServiceEntriesCreationDTO dto)
        {
            if (string.IsNullOrEmpty(dto.ServiceName) || dto.Document == null)
            {
                return;
            }
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
                if (item.SignedFileKey != null)
                    item.SignedFileKey = cloudinaryServices.GetFileUrl(item.SignedFileKey);
            }
            return service;
        } 


        [HttpGet("GetService")]
        public async Task<ServiceEntriesSchema> GetServiceDetails(string serviceId)
        {
            var service = await serviceEntriesServices.GetSetvice(serviceId);
            service.OriginalFileKey = cloudinaryServices.GetFileUrl(service.OriginalFileKey);
            if (service.SignedFileKey != null)
                service.SignedFileKey = cloudinaryServices.GetFileUrl(service.SignedFileKey);
            return service;
        }


        [HttpPost("UpdateSignDetails")]
        public async Task UpdateSignFieldDetails(string serviceId, string toEmail, List<SignatureField> signs)
        {
            await serviceEntriesServices.UpdateSignFieldDetails(serviceId, signs);
            await emailService.SendMail(toEmail, serviceId);
        }


        [HttpPost("UpdateSign")]
        public async Task UpdateSign(SignatureUpdateDTO signs)
        {
            ServiceEntriesSchema serviveEntry = await serviceEntriesServices.UpdateSign(signs);

            if(serviveEntry == null)
            {
                return;
            }

            var pdfByte = await cloudinaryServices.DownloadFile(cloudinaryServices.GetFileUrl(serviveEntry.OriginalFileKey));
            var updatedPdf = cloudinaryServices.UpdatePdf(pdfByte, serviveEntry.SignatureField!, serviveEntry.RecipientSignature!);
            string updatedPdfPath = await cloudinaryServices.UploadUpdatedFile(serviveEntry.Id!, updatedPdf);

            await serviceEntriesServices.UpdateSignedPdfPath(serviveEntry.Id!, updatedPdfPath);
        }
    
    }
}
