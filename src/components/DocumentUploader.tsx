
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Check, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  documentType: string;
}

const DocumentUploader = ({ onUpload, documentType }: DocumentUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      handleFile(uploadedFile);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      handleFile(uploadedFile);
    }
  };

  const handleFile = (uploadedFile: File) => {
    // Check file type and size here
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(uploadedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPG, PNG or PDF file",
        variant: "destructive",
      });
      return;
    }

    if (uploadedFile.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setFile(uploadedFile);
    onUpload(uploadedFile);
    toast({
      title: "File uploaded",
      description: "Your document has been uploaded successfully",
    });
  };

  const clearFile = () => {
    setFile(null);
  };

  return (
    <Card className={`border-2 ${dragActive ? 'border-blockchain-blue border-dashed bg-blockchain-light' : file ? 'border-green-500' : 'border-dashed'} transition-all duration-200`}>
      <CardContent className="p-6">
        {!file ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center py-8"
          >
            <Upload className="h-12 w-12 text-gray-400 mb-4" />
            <p className="font-medium text-lg mb-2">Upload your {documentType}</p>
            <p className="text-sm text-gray-500 mb-6 text-center">
              Drag and drop your file here, or click to browse
              <br />
              JPG, PNG or PDF (max 5MB)
            </p>
            <Button
              as="label"
              htmlFor={`file-upload-${documentType}`}
              variant="outline"
              className="cursor-pointer"
            >
              Browse Files
              <input
                id={`file-upload-${documentType}`}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium truncate max-w-xs">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
