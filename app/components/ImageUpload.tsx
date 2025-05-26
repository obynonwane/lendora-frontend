import React, { useRef } from "react";

interface ImageUploadProps {
  value?: File | File[] | null;
  onImageChange?: (file: File | File[] | null) => void;
  allowMultiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onImageChange,
  allowMultiple = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = allowMultiple
    ? (value as File[]) || []
    : value
    ? [value as File]
    : [];

  const previewUrls = files.map((file) => URL.createObjectURL(file));

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const validImages = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (!validImages.length) {
      alert("Please select valid image files.");
      return;
    }

    if (allowMultiple) {
      const updatedFiles = [...files, ...validImages];
      onImageChange?.(updatedFiles);
    } else {
      onImageChange?.(validImages[0]);
    }
  };

  const handleRemove = (index: number) => {
    if (allowMultiple) {
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      onImageChange?.(updatedFiles);
    } else {
      onImageChange?.(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple={allowMultiple}
      />

      <div
        onClick={handleFileSelect}
        className={`cursor-pointer w-full relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gray-50 hover:bg-gray-100 transition overflow-hidden ${
          !allowMultiple && previewUrls.length ? "h-64" : "py-3"
        }`}
      >
        {!allowMultiple && previewUrls.length > 0 ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(0);
              }}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded transition"
            >
              ✕
            </button>
            <img
              src={previewUrls[0]}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </>
        ) : (
          <span className="text-gray-600 text-sm">
            Click to upload {allowMultiple ? "images" : "an image"}
          </span>
        )}
      </div>

      {allowMultiple && previewUrls.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 w-full">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
