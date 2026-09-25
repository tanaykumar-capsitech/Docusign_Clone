using PdfSharp.Fonts;

namespace backend
{
    public class CustomFontResolver: IFontResolver
    {
        public string DefaultFontName => "Caveat";

        public byte[] GetFont(string faceName)
        {
            var path = Path.Combine(
                AppContext.BaseDirectory,
                "Font",
                "Caveat-Regular.ttf"
            );

            return File.ReadAllBytes(path);
        }

        public FontResolverInfo? ResolveTypeface(
            string familyName,
            bool isBold,
            bool isItalic)
        {
            if (familyName.Equals("Caveat", StringComparison.OrdinalIgnoreCase))
            {
                return new FontResolverInfo("Caveat-Regular");
            }

            return PlatformFontResolver.ResolveTypeface(
                familyName,
                isBold,
                isItalic
            );
        }
    }
}
