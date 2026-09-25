using backend.Models;
using backend.Settings;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
using PdfSharp.Drawing;
using PdfSharp.Pdf;
using PdfSharp.Fonts;
using PdfSharp.Pdf.IO;

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

        public async Task<string> UploadUpdatedFile(string fileName, byte[] pdfStream)
        {
            await using var stream =new MemoryStream(pdfStream);

            var uploadParams = new RawUploadParams
            {
                File = new FileDescription(fileName, stream)
            };

            var result = await cloud.UploadAsync(uploadParams);
            return result.PublicId;
        }


        public string GetFileUrl(string publicId)
        {
            return $"https://res.cloudinary.com/kkewel7l/raw/upload/{publicId}";
        }


        public async Task<byte[]> DownloadFile(string fileUrl)
        {
            using var httpClient = new HttpClient();
            return await httpClient.GetByteArrayAsync(fileUrl);
        }


        public byte[] UpdatePdf(byte[] pdfByte, List<SignatureField> signatureFields, string signature)
        {
            using var inputSetream = new MemoryStream(pdfByte);

            using PdfDocument document = PdfReader.Open(
                    inputSetream,
                    PdfDocumentOpenMode.Modify
                );

            foreach (var item in signatureFields)
            {
                PdfPage page = document.Pages[item.Page - 1];

                using XGraphics gfx = XGraphics.FromPdfPage(page);

                var rect = new XRect( 
                    item.X, 
                    item.Y, 
                    item.Width, 
                    item.Height
                );

                XFont font = new XFont("Caveat", 24);

                gfx.DrawString(
                    signature,
                    font,
                    XBrushes.Black,
                    rect,
                    XStringFormats.Center
                );
            }

            using var outputStream = new MemoryStream();

            document.Save(outputStream, false);

            return outputStream.ToArray();
        }
    }
}
