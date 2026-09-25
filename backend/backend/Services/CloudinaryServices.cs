using backend.Models;
using backend.Settings;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Font;
using iText.IO.Font;
using iText.IO.Font.Constants;
using iText.Kernel.Geom;
using Microsoft.Extensions.Options;
using System.IO;

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
            using var outputStream = new MemoryStream();

            var reader = new PdfReader(inputSetream);
            var writer = new PdfWriter(outputStream);

            using var document = new PdfDocument(reader,writer);

            var fontPath = System.IO.Path.Combine(
                AppContext.BaseDirectory,
                "Font",
                "Caveat-Regular.ttf"
            );

            PdfFont font = PdfFontFactory.CreateFont(
                fontPath,
                PdfEncodings.IDENTITY_H,
                PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED
            );

            foreach (var item in signatureFields)
            {
                PdfPage page = document.GetPage(item.Page);

                Rectangle pageSize = page.GetPageSize();

                float pageWidth = pageSize.GetWidth();
                float pageHeight = pageSize.GetHeight();

                double x = item.X;
                double y = pageHeight - item.Y - item.Height;

                var canvas = new PdfCanvas(page);

                canvas.BeginText();

                canvas.SetFontAndSize(font, 24);

                canvas.MoveText(x, y);

                canvas.ShowText(signature);

                canvas.EndText();
            }


            document.Close();

            return outputStream.ToArray();
        }
    }
}
