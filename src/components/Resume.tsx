
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Resume = () => {
  // Static resume file information - you can update these details
  const resumeInfo = {
    name: "Sai_Aakash_Resume.pdf",
    size: "1.2 MB", // Update with actual size
    downloadUrl: "/resume/Sai_Aakash_Resume.pdf", // Update with actual path
    lastUpdated: "December 2024"
  };

  const handleDownload = () => {
    // Create download link
    const link = document.createElement('a');
    link.href = resumeInfo.downloadUrl;
    link.download = resumeInfo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = () => {
    window.open(resumeInfo.downloadUrl, '_blank');
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="section-heading text-center gradient-text">Resume</h2>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Download my latest resume to learn more about my experience and qualifications.
          </p>

          <Card className="portfolio-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary" />
                Resume Document
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-6">
                <div className="bg-primary/10 rounded-lg p-8">
                  <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {resumeInfo.name}
                  </h3>
                  <p className="text-muted-foreground mb-2">
                    Size: {resumeInfo.size}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {resumeInfo.lastUpdated}
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button onClick={handleView} variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Resume
                  </Button>
                  <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Resume;
