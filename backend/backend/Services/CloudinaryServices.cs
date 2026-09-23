using backend.Settings;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace backend.Services
{
    public class CloudinaryServices
    {
        private readonly Cloudinary cloud;

        public CloudinaryServices(IOptions<CloudinarySettings> cloudSettings)
        {
            var account = new Account(cloudSettings.Value.CloudName, cloudSettings.Value.ApiKey, cloudSettings.Value.ApiSecrect);

            cloud = new Cloudinary(account);
        }

        public async Task<string> UploadFile(IFormFile file)
        {
            await using var stream = file.OpenReadStream();

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(file.FileName, stream)
            };

            var result = await cloud.UploadAsync(uploadParams);

            return result.PublicId;
        }

        public string GetFileUrl(string publicId)
        {
            return $"https://res.cloudinary.com/kkewel7l/raw/upload/{publicId}";
        }
    }
}
