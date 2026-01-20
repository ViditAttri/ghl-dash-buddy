-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true);

-- Allow public read access to resumes
CREATE POLICY "Public read access for resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes');

-- Allow authenticated users to upload resumes (optional, for future admin use)
CREATE POLICY "Allow uploads to resumes bucket"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- Allow updates to resumes
CREATE POLICY "Allow updates to resumes bucket"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'resumes');

-- Allow deletes from resumes
CREATE POLICY "Allow deletes from resumes bucket"
ON storage.objects
FOR DELETE
USING (bucket_id = 'resumes');