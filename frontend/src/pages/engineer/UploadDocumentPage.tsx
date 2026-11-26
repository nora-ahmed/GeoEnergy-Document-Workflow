
import { useState, type FormEvent, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  FileImage,
  X,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/useAuth";
import { uploadDocument } from "../../api/documentApi";
import "./UploadDocumentPage.css";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const UploadDocumentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    const allowedExtensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];
    const extension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError(t("upload.invalidFileType"));
      event.target.value = "";
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(t("upload.fileTooLarge"));
      event.target.value = "";
      return;
    }

    if (selectedFile.size === 0) {
      setError(t("upload.emptyFile"));
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError(t("upload.fileRequired"));
      return;
    }

    setIsUploading(true);

    try {
      await uploadDocument({
        title: title.trim(),
        documentType: documentType.trim(),
        file,
      });

      setUploaded(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const response = err.response?.data;

        setError(
          response?.message ||
            response?.title ||
            t("upload.error")
        );
      } else {
        setError(t("upload.unexpectedError"));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (size: number) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (uploaded) {
    return (
      <div className="upload-page">
        <div className="upload-success">
          <div className="success-icon">
            <CheckCircle2 size={42} />
          </div>

          <h1>{t("upload.successTitle")}</h1>
          <p>{t("upload.successDescription")}</p>

          <button
            className="upload-submit-button"
            onClick={() => navigate("/engineer/documents")}
          >
            {t("upload.viewMyDocuments")}
          </button>

          <button
            className="upload-secondary-button"
            onClick={() => {
              setTitle("");
              setDocumentType("");
              setFile(null);
              setError("");
              setUploaded(false);
            }}
          >
            {t("upload.uploadAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="upload-page">
      <button
        className="upload-back-button"
        onClick={() => navigate("/engineer")}
      >
        <ArrowLeft size={17} />
        {t("upload.backToDashboard")}
      </button>

      <div className="upload-page-heading">
        <div>
          <span className="upload-eyebrow">{t("upload.eyebrow")}</span>
          <h1>{t("upload.title")}</h1>
          <p>{t("upload.subtitle")}</p>
        </div>
      </div>

      <div className="upload-content">
        <form className="upload-form-card" onSubmit={handleSubmit}>
          <div className="upload-card-heading">
            <h2>{t("upload.informationTitle")}</h2>
            <p>{t("upload.informationDescription")}</p>
          </div>

          {error && (
            <div className="upload-error" role="alert">
              {error}
            </div>
          )}

          <div className="upload-field">
            <label htmlFor="document-title">
              {t("upload.documentTitle")} <span>*</span>
            </label>

            <input
              id="document-title"
              type="text"
              placeholder={t("upload.titlePlaceholder")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              minLength={3}
              maxLength={200}
              required
            />

            <small>{t("upload.titleHint")}</small>
          </div>

          <div className="upload-field">
            <label htmlFor="document-type">
              {t("upload.documentType")} <span>*</span>
            </label>

            <input
              id="document-type"
              type="text"
              placeholder={t("upload.typePlaceholder")}
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="upload-field">
            <label htmlFor="document-department">
              {t("common.department")}
            </label>

            <input
              id="document-department"
              type="text"
              value={user?.department || ""}
              readOnly
              className="readonly-field"
            />

            <small>{t("upload.departmentHint")}</small>
          </div>

          <div className="upload-field">
            <label>
              {t("upload.attachDocument")} <span>*</span>
            </label>

            <label className="file-dropzone" htmlFor="document-file">
              <div className="file-upload-icon">
                <Upload size={25} />
              </div>

              <strong>{t("upload.browseFiles")}</strong>
              <span>{t("upload.selectFileDescription")}</span>
              <small>{t("upload.supportedFormats")}</small>

              <input
                id="document-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                hidden
              />
            </label>

            {file && (
              <div className="selected-file">
                <div className="selected-file-icon">
                  {file.type === "application/pdf" ? (
                    <FileText size={21} />
                  ) : (
                    <FileImage size={21} />
                  )}
                </div>

                <div className="selected-file-info">
                  <strong>{file.name}</strong>
                  <span>{formatFileSize(file.size)}</span>
                </div>

                <button
                  type="button"
                  className="remove-file-button"
                  onClick={() => {
                    setFile(null);
                    const input = document.getElementById(
                      "document-file"
                    ) as HTMLInputElement;

                    if (input) input.value = "";
                  }}
                  aria-label={t("upload.removeFile")}
                  title={t("upload.removeFile")}
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="upload-form-footer">
            <button
              type="button"
              className="upload-cancel-button"
              onClick={() => navigate("/engineer")}
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="upload-submit-button"
              disabled={isUploading || !file}
            >
              <Upload size={17} />
              {isUploading
                ? t("upload.uploading")
                : t("upload.submitForApproval")}
            </button>
          </div>
        </form>

        <aside className="upload-info-card">
          <div className="upload-info-icon">
            <ShieldCheck size={23} />
          </div>

          <h3>{t("upload.whatHappensNext")}</h3>

          <p>{t("upload.workflowDescription")}</p>

          <div className="upload-step">
            <span>01</span>
            <div>
              <strong>{t("upload.stepOneTitle")}</strong>
              <p>{t("upload.stepOneDescription")}</p>
            </div>
          </div>

          <div className="upload-step">
            <span>02</span>
            <div>
              <strong>{t("upload.stepTwoTitle")}</strong>
              <p>{t("upload.stepTwoDescription")}</p>
            </div>
          </div>

          <div className="upload-step">
            <span>03</span>
            <div>
              <strong>{t("upload.stepThreeTitle")}</strong>
              <p>{t("upload.stepThreeDescription")}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UploadDocumentPage;
