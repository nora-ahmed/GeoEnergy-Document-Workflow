
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      app: {
        name: "GeoEnergy",
        subtitle: "Document Workflow System",
      },

      documentActions: {
        resubmit: "Resubmit Document",
        selectFile: "Choose replacement file",
        submitReplacement: "Submit Replacement",
        resubmitting: "Resubmitting...",
        resubmitSuccess: "Document resubmitted successfully",
        resubmitError: "Failed to resubmit document",
        preview: "Preview",
        download: "Download",
        previewTitle: "Document Preview",
        closePreview: "Close Preview",
        noPreview: "Preview is not available for this file type",
        fileRequired: "Please select a file",
        supportedFiles: "Supported formats: PDF, JPG, JPEG, PNG, WebP",
        resubmitDescription:
          "Upload a replacement file to resubmit this rejected document.",
        previewError: "Unable to preview this document.",
        downloadError: "Unable to download this document.",
      },

      managerDashboard: {
        eyebrow: "MANAGEMENT OVERVIEW",
        title: "Manager Dashboard",
        subtitle: "Monitor document submissions and approval activity.",
        refresh: "Refresh",
        loadError: "Unable to load dashboard data.",
        totalDocuments: "Total Documents",
        pendingApproval: "Pending Approval",
        approved: "Approved",
        rejected: "Rejected",
        recentDocuments: "Recent Documents",
        recentDescription:
          "The latest documents submitted across departments.",
        uploadedBy: "Uploaded By",
        uploadedAt: "Upload Date",
        noDocuments: "No documents have been submitted yet.",

        analytics: "Document Analytics",
        analyticsDescription:
          "Overview of document status and department activity.",
        statusDistribution: "Documents by Status",
        statusDescription:
          "Distribution of documents across approval statuses.",
        departmentDistribution: "Documents by Department",
        departmentDescription:
          "Compare document submissions across departments.",
        documentsCount: "Documents",
        noChartData: "No data available yet.",
        chartsError: "Unable to load dashboard charts.",
      },

      common: {
        welcome: "Welcome back",
        loading: "Loading...",
        search: "Search",
        cancel: "Cancel",
        save: "Save",
        tryAgain: "Try again",
        submit: "Submit",
        retry: "Try again",
        viewAll: "View all",
        actions: "Actions",
        status: "Status",
        department: "Department",
        notAvailable: "Not available",
        date: "Date",
        document: "Document",
        noDocuments: "No documents found",
        allRightsReserved: "All rights reserved.",
      },

      documentDetails: {
        eyebrow: "DOCUMENT DETAILS",
        backToDocuments: "Back to My Documents",
        loading: "Loading document details...",
        loadError: "Unable to load this document. Please try again.",
        invalidId: "Invalid document ID.",
        information: "Document Information",
        reviewedBy: "Reviewed by",
        rejectionComment: "Rejection comment",
        versions: "Document Versions",
        version: "Version",
        noVersions: "No versions are available.",
        history: "Document History",
        noHistory: "No history is available.",
        actions: {
          uploaded: "Document uploaded",
          submitted: "Document submitted",
          resubmitted: "Document resubmitted",
          approved: "Document approved",
          rejected: "Document rejected",
        },
      },

      auth: {
        login: "Sign in",
        username: "Username",
        password: "Password",
        logout: "Sign out",
        loginTitle: "Sign in to your account",
        loginSubtitle:
          "Enter your credentials to access your workspace.",
        loginButton: "Sign in",
        invalidCredentials: "Invalid username or password.",
        brandEyebrow: "DOCUMENT WORKFLOW",
        brandTitle: "Bringing your documents under control.",
        brandDescription:
          "A smarter way to submit, manage, and approve documents. Keep every step organized and every decision transparent.",
        secureTitle: "Secure document management",
        secureDescription:
          "Controlled access. Clear approval workflows.",
        welcomeBack: "WELCOME BACK",
        usernamePlaceholder: "Enter your username",
        passwordPlaceholder: "Enter your password",
        showPassword: "Show password",
        hidePassword: "Hide password",
        signingIn: "Signing in...",
        securityMessage:
          "Your account is protected with secure authentication.",
        unexpectedError: "Something went wrong. Please try again.",
      },

      navigation: {
        overview: "Overview",
        myDocuments: "My Documents",
        uploadDocument: "Upload Document",
        allDocuments: "All Documents",
        pendingReviews: "Pending Reviews",
        workspace: "WORKSPACE",
        managerPortal: "Manager Portal",
        engineerPortal: "Engineer Portal",
        closeNavigation: "Close navigation",
        openNavigation: "Open navigation",
      },

      roles: {
        manager: "Manager",
        engineer: "Engineer",
      },

      managerReview: {
        eyebrow: "DOCUMENT REVIEW",
        backToDocuments: "Back to all documents",
        reviewDocument: "Review Document",
        reviewDescription:
          "Review the document before making an approval decision.",
        approve: "Approve Document",
        reject: "Reject Document",
        confirmReject: "Confirm Rejection",
        rejectionComment: "Rejection Comment",
        commentPlaceholder:
          "Explain why this document is being rejected...",
        commentRequired: "Please provide a rejection comment.",
        approveSuccess: "Document approved successfully.",
        approveError:
          "Unable to approve this document. Please try again.",
        rejectSuccess: "Document rejected successfully.",
        rejectError:
          "Unable to reject this document. Please try again.",
      },

      pendingReviews: {
        eyebrow: "DOCUMENT REVIEW",
        title: "Pending Reviews",
        description:
          "Review and process documents waiting for your approval.",
        pendingCount: "Awaiting your review",
        searchPlaceholder:
          "Search pending documents by title...",
        review: "Review",
        emptyTitle: "No pending reviews",
        emptyDescription:
          "There are currently no documents waiting for approval.",
        loadError:
          "Unable to load pending documents. Please try again.",
      },

      dashboard: {
        engineerTitle: "Your Dashboard",
        engineerSubtitle:
          "Here's an overview of your document activity.",
        managerTitle: "Manager Dashboard",
        managerSubtitle:
          "Manage and review submitted documents.",
        totalDocuments: "Total Documents",
        pendingApproval: "Pending Approval",
        approved: "Approved",
        rejected: "Rejected",
        recentDocuments: "Recent Documents",
        quickAccess: "Quick Access",
        browseDocuments: "Browse My Documents",
        noDocuments: "No documents yet",
        noDocumentsDescription:
          "Your uploaded documents will appear here.",
        loadError: "Unable to load your dashboard.",
        welcomeBack: "Welcome back, {{name}}",
        recentDocumentsDescription:
          "Keep track of your latest submissions.",
        loadingRecentDocuments:
          "Loading your recent documents...",
        quickAccessDescription:
          "Manage your documents easily.",
      },

      documents: {
        title: "Documents",
        searchPlaceholder: "Search documents by title...",
        documentType: "Document Type",
        uploadedAt: "Submitted",
        uploadedBy: "Uploaded By",
        reviewedAt: "Reviewed At",
        filterByStatus: "Filter by status",
        filterByDepartment: "Filter by department",
        allStatuses: "All statuses",
        allDepartments: "All departments",
        previous: "Previous",
        next: "Next",
        page: "Page",
        eyebrow: "DOCUMENT MANAGEMENT",
        myDocuments: "My Documents",
        description:
          "Track and manage all the documents you have submitted.",
        totalDocuments: "Total documents",
        allDocumentTypes: "All document types",
        invoice: "Invoice",
        contract: "Contract",
        report: "Report",
        other: "Other",
        loadingDocuments: "Loading your documents...",
        loadError:
          "Unable to load your documents. Please try again.",
        tryAgain: "Try again",
        emptyTitle: "No documents found",
        emptyDescription:
          "Try changing your search or filters.",
        showingPage: "Showing page",
        of: "of",
        documentId: "Document ID",
      },

      upload: {
        title: "Upload Document",
        subtitle: "Submit a new document for approval.",
        documentTitle: "Document Title",
        documentType: "Document Type",
        chooseFile: "Choose File",
        dragDrop: "Drag and drop your file here",
        supportedFormats:
          "Supported formats: PDF, JPG, PNG, WebP",
        uploadButton: "Upload Document",
        success: "Document uploaded successfully.",
        error: "Failed to upload document.",
        eyebrow: "DOCUMENT MANAGEMENT",
        backToDashboard: "Back to Dashboard",
        informationTitle: "Document Information",
        informationDescription:
          "Fill in the details of the document you're submitting.",
        titlePlaceholder: "e.g. Project Technical Report",
        titleHint:
          "Enter a title between 3 and 200 characters.",
        typePlaceholder: "e.g. Technical Report",
        departmentHint:
          "Your department is assigned automatically.",
        attachDocument: "Attach Document",
        browseFiles: "Click to browse files",
        selectFileDescription:
          "or select a file from your device",
        removeFile: "Remove selected file",
        uploading: "Uploading...",
        submitForApproval: "Submit for Approval",
        successTitle: "Document uploaded successfully!",
        successDescription:
          "Your document has been submitted and is now pending manager approval.",
        viewMyDocuments: "View My Documents",
        uploadAnother: "Upload Another Document",
        whatHappensNext: "What happens next?",
        workflowDescription:
          "Once you submit your document, it enters the approval workflow.",
        stepOneTitle: "Document submitted",
        stepOneDescription:
          "Your document is securely uploaded.",
        stepTwoTitle: "Manager review",
        stepTwoDescription:
          "Your manager reviews the submission.",
        stepThreeTitle: "Approval decision",
        stepThreeDescription:
          "You'll be able to track its status.",
        invalidFileType:
          "Please select a PDF, JPG, PNG, or WebP file.",
        fileTooLarge:
          "File size must not exceed 10 MB.",
        emptyFile: "The selected file is empty.",
        fileRequired:
          "Please select a document to upload.",
        unexpectedError:
          "Something went wrong. Please try again.",
      },

      managerDocuments: {
        eyebrow: "DOCUMENT MANAGEMENT",
        title: "All Documents",
        description:
          "View and manage documents submitted across departments.",
        totalDocuments: "Total Documents",
        searchPlaceholder: "Search documents by title...",
        departmentPlaceholder: "Filter by department...",
        uploadedBy: "Uploaded By",
        loadError:
          "Unable to load documents. Please try again.",
      },

      status: {
        pending: "Pending Approval",
        approved: "Approved",
        rejected: "Rejected",
      },

      manager: {
        approve: "Approve",
        reject: "Reject",
        rejectionComment: "Rejection Comment",
        rejectionRequired:
          "Please provide a rejection reason.",
        reviewDocuments: "Review Documents",
      },

      language: {
        english: "English",
        arabic: "العربية",
      },
    },
  },

  ar: {
    translation: {
      app: {
        name: "جيو إنرجي",
        subtitle: "نظام إدارة سير عمل المستندات",
      },

      pendingReviews: {
        eyebrow: "مراجعة المستندات",
        title: "المستندات قيد المراجعة",
        description:
          "راجع المستندات التي تنتظر موافقتك واتخذ الإجراء المناسب.",
        pendingCount: "في انتظار مراجعتك",
        searchPlaceholder:
          "ابحث عن المستندات المعلقة بالعنوان...",
        review: "مراجعة",
        emptyTitle: "لا توجد مستندات معلقة",
        emptyDescription:
          "لا توجد مستندات تنتظر الموافقة حاليًا.",
        loadError:
          "تعذر تحميل المستندات المعلقة. حاول مرة أخرى.",
      },

      common: {
        welcome: "مرحباً بعودتك",
        loading: "جارٍ التحميل...",
        search: "بحث",
        cancel: "إلغاء",
        save: "حفظ",
        submit: "إرسال",
        retry: "إعادة المحاولة",
        viewAll: "عرض الكل",
        actions: "الإجراءات",
        status: "الحالة",
        department: "القسم",
        date: "التاريخ",
        notAvailable: "غير متاح",
        document: "المستند",
        tryAgain: "إعادة المحاولة",
        noDocuments: "لا توجد مستندات",
        allRightsReserved: "جميع الحقوق محفوظة.",
      },

      documentActions: {
        resubmit: "إعادة تقديم المستند",
        selectFile: "اختر الملف البديل",
        submitReplacement: "إرسال الملف البديل",
        resubmitting: "جارٍ إعادة التقديم...",
        resubmitSuccess: "تمت إعادة تقديم المستند بنجاح",
        resubmitError: "فشلت إعادة تقديم المستند",
        preview: "معاينة",
        download: "تحميل",
        previewTitle: "معاينة المستند",
        closePreview: "إغلاق المعاينة",
        noPreview:
          "المعاينة غير متاحة لهذا النوع من الملفات",
        fileRequired: "يرجى اختيار ملف",
        supportedFiles:
          "الصيغ المدعومة: PDF, JPG, JPEG, PNG, WebP",
        resubmitDescription:
          "ارفع ملفًا بديلًا لإعادة تقديم هذا المستند المرفوض.",
        previewError: "تعذرت معاينة هذا المستند.",
        downloadError: "تعذر تحميل هذا المستند.",
      },

      managerDashboard: {
        eyebrow: "نظرة عامة على الإدارة",
        title: "لوحة تحكم المدير",
        subtitle: "تابع المستندات المقدمة وعمليات الموافقة.",
        refresh: "تحديث",
        loadError: "تعذر تحميل بيانات لوحة التحكم.",
        totalDocuments: "إجمالي المستندات",
        pendingApproval: "بانتظار الموافقة",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        recentDocuments: "أحدث المستندات",
        recentDescription:
          "أحدث المستندات المقدمة عبر الأقسام.",
        uploadedBy: "تم الرفع بواسطة",
        uploadedAt: "تاريخ الرفع",
        noDocuments:
          "لم يتم تقديم أي مستندات حتى الآن.",

        analytics: "تحليلات المستندات",
        analyticsDescription:
          "نظرة عامة على حالات المستندات ونشاط الأقسام.",
        statusDistribution: "المستندات حسب الحالة",
        statusDescription:
          "توزيع المستندات حسب حالات الموافقة.",
        departmentDistribution: "المستندات حسب القسم",
        departmentDescription:
          "مقارنة عدد المستندات المقدمة من الأقسام.",
        documentsCount: "المستندات",
        noChartData: "لا توجد بيانات متاحة حاليًا.",
        chartsError: "تعذر تحميل الرسوم البيانية.",
      },

      managerDocuments: {
        eyebrow: "إدارة المستندات",
        title: "جميع المستندات",
        description:
          "عرض وإدارة المستندات المقدمة من جميع الأقسام.",
        totalDocuments: "إجمالي المستندات",
        searchPlaceholder:
          "ابحث عن المستندات بالعنوان...",
        departmentPlaceholder: "تصفية حسب القسم...",
        uploadedBy: "تم الرفع بواسطة",
        loadError:
          "تعذر تحميل المستندات. حاول مرة أخرى.",
      },

      managerReview: {
        eyebrow: "مراجعة المستندات",
        backToDocuments: "العودة إلى جميع المستندات",
        reviewDocument: "مراجعة المستند",
        reviewDescription:
          "راجع المستند قبل اتخاذ قرار الموافقة أو الرفض.",
        approve: "الموافقة على المستند",
        reject: "رفض المستند",
        confirmReject: "تأكيد الرفض",
        rejectionComment: "سبب الرفض",
        commentPlaceholder:
          "اشرح سبب رفض هذا المستند...",
        commentRequired: "يرجى إدخال سبب الرفض.",
        approveSuccess:
          "تمت الموافقة على المستند بنجاح.",
        approveError:
          "تعذرت الموافقة على المستند. حاول مرة أخرى.",
        rejectSuccess: "تم رفض المستند بنجاح.",
        rejectError:
          "تعذر رفض المستند. حاول مرة أخرى.",
      },

      documentDetails: {
        eyebrow: "تفاصيل المستند",
        backToDocuments: "العودة إلى مستنداتي",
        loading: "جارٍ تحميل تفاصيل المستند...",
        loadError:
          "تعذر تحميل المستند. يرجى المحاولة مرة أخرى.",
        invalidId: "رقم المستند غير صالح.",
        information: "معلومات المستند",
        reviewedBy: "تمت المراجعة بواسطة",
        rejectionComment: "تعليق الرفض",
        versions: "إصدارات المستند",
        version: "الإصدار",
        noVersions: "لا توجد إصدارات متاحة.",
        history: "سجل المستند",
        noHistory: "لا يوجد سجل متاح.",
        actions: {
          uploaded: "تم رفع المستند",
          submitted: "تم تقديم المستند",
          resubmitted: "تمت إعادة تقديم المستند",
          approved: "تمت الموافقة على المستند",
          rejected: "تم رفض المستند",
        },
      },

      auth: {
        login: "تسجيل الدخول",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        logout: "تسجيل الخروج",
        loginTitle: "تسجيل الدخول إلى حسابك",
        loginSubtitle:
          "أدخل بياناتك للوصول إلى مساحة العمل الخاصة بك.",
        loginButton: "تسجيل الدخول",
        invalidCredentials:
          "اسم المستخدم أو كلمة المرور غير صحيحة.",
        brandEyebrow: "إدارة المستندات",
        brandTitle: "تحكم كامل في مستنداتك.",
        brandDescription:
          "طريقة أكثر ذكاءً لإرسال المستندات وإدارتها والموافقة عليها. نظّم كل خطوة واجعل كل قرار واضحًا.",
        secureTitle: "إدارة آمنة للمستندات",
        secureDescription:
          "صلاحيات وصول محددة وسير عمل واضح للموافقات.",
        welcomeBack: "مرحبًا بعودتك",
        usernamePlaceholder: "أدخل اسم المستخدم",
        passwordPlaceholder: "أدخل كلمة المرور",
        showPassword: "إظهار كلمة المرور",
        hidePassword: "إخفاء كلمة المرور",
        signingIn: "جارٍ تسجيل الدخول...",
        securityMessage:
          "حسابك محمي باستخدام نظام مصادقة آمن.",
        unexpectedError:
          "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
      },

      navigation: {
        overview: "نظرة عامة",
        myDocuments: "مستنداتي",
        uploadDocument: "رفع مستند",
        allDocuments: "جميع المستندات",
        pendingReviews: "المراجعات المعلقة",
        workspace: "مساحة العمل",
        managerPortal: "بوابة المدير",
        engineerPortal: "بوابة المهندس",
        closeNavigation: "إغلاق القائمة",
        openNavigation: "فتح القائمة",
      },

      roles: {
        manager: "مدير",
        engineer: "مهندس",
      },

      dashboard: {
        engineerTitle: "لوحة التحكم",
        engineerSubtitle:
          "إليك نظرة عامة على نشاط مستنداتك.",
        managerTitle: "لوحة تحكم المدير",
        managerSubtitle:
          "إدارة ومراجعة المستندات المقدمة.",
        totalDocuments: "إجمالي المستندات",
        pendingApproval: "بانتظار الموافقة",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
        recentDocuments: "أحدث المستندات",
        quickAccess: "الوصول السريع",
        browseDocuments: "تصفح مستنداتي",
        noDocuments: "لا توجد مستندات حتى الآن",
        noDocumentsDescription:
          "ستظهر المستندات التي تقوم برفعها هنا.",
        loadError: "تعذر تحميل لوحة التحكم.",
        welcomeBack: "مرحبًا بعودتك، {{name}}",
        recentDocumentsDescription:
          "تابع أحدث المستندات التي قمت بتقديمها.",
        loadingRecentDocuments:
          "جارٍ تحميل أحدث مستنداتك...",
        quickAccessDescription:
          "أدر مستنداتك بسهولة.",
      },

      documents: {
        title: "المستندات",
        searchPlaceholder: "ابحث عن مستند بالعنوان...",
        documentType: "نوع المستند",
        uploadedAt: "تاريخ التقديم",
        uploadedBy: "تم الرفع بواسطة",
        reviewedAt: "تاريخ المراجعة",
        filterByStatus: "تصفية حسب الحالة",
        filterByDepartment: "تصفية حسب القسم",
        allStatuses: "جميع الحالات",
        allDepartments: "جميع الأقسام",
        previous: "السابق",
        next: "التالي",
        page: "صفحة",
        eyebrow: "إدارة المستندات",
        myDocuments: "مستنداتي",
        description:
          "تابع وأدر جميع المستندات التي قمت بتقديمها.",
        totalDocuments: "إجمالي المستندات",
        allDocumentTypes: "جميع أنواع المستندات",
        invoice: "فاتورة",
        contract: "عقد",
        report: "تقرير",
        other: "أخرى",
        loadingDocuments: "جارٍ تحميل المستندات...",
        loadError:
          "تعذر تحميل المستندات. يرجى المحاولة مرة أخرى.",
        tryAgain: "إعادة المحاولة",
        emptyTitle: "لا توجد مستندات",
        emptyDescription:
          "حاول تغيير البحث أو عوامل التصفية.",
        showingPage: "عرض الصفحة",
        of: "من",
        documentId: "رقم المستند",
      },

      upload: {
        title: "رفع مستند",
        subtitle:
          "قدّم مستنداً جديداً للمراجعة والموافقة.",
        documentTitle: "عنوان المستند",
        documentType: "نوع المستند",
        chooseFile: "اختر ملفاً",
        dragDrop: "اسحب الملف وأفلته هنا",
        supportedFormats:
          "الصيغ المدعومة: PDF و JPG و PNG و WebP",
        uploadButton: "رفع المستند",
        success: "تم رفع المستند بنجاح.",
        error: "فشل رفع المستند.",
        eyebrow: "إدارة المستندات",
        backToDashboard: "العودة إلى لوحة التحكم",
        informationTitle: "معلومات المستند",
        informationDescription:
          "أدخل تفاصيل المستند الذي تريد تقديمه.",
        titlePlaceholder: "مثال: التقرير الفني للمشروع",
        titleHint:
          "أدخل عنوانًا يتراوح بين 3 و200 حرف.",
        typePlaceholder: "مثال: تقرير فني",
        departmentHint:
          "يتم تحديد القسم الخاص بك تلقائيًا.",
        attachDocument: "إرفاق المستند",
        browseFiles: "اضغط لاختيار ملف",
        selectFileDescription:
          "أو اختر ملفًا من جهازك",
        removeFile: "إزالة الملف المحدد",
        uploading: "جارٍ الرفع...",
        submitForApproval: "إرسال للموافقة",
        successTitle: "تم رفع المستند بنجاح!",
        successDescription:
          "تم إرسال المستند وهو الآن في انتظار موافقة المدير.",
        viewMyDocuments: "عرض مستنداتي",
        uploadAnother: "رفع مستند آخر",
        whatHappensNext: "ماذا يحدث بعد ذلك؟",
        workflowDescription:
          "بعد إرسال المستند، يدخل في دورة المراجعة والموافقة.",
        stepOneTitle: "تم إرسال المستند",
        stepOneDescription:
          "تم رفع المستند الخاص بك بشكل آمن.",
        stepTwoTitle: "مراجعة المدير",
        stepTwoDescription:
          "يقوم المدير بمراجعة المستند المقدم.",
        stepThreeTitle: "قرار الموافقة",
        stepThreeDescription:
          "ستتمكن من متابعة حالة المستند.",
        invalidFileType:
          "يرجى اختيار ملف PDF أو JPG أو PNG أو WebP.",
        fileTooLarge:
          "يجب ألا يتجاوز حجم الملف 10 ميجابايت.",
        emptyFile: "الملف المحدد فارغ.",
        fileRequired: "يرجى اختيار مستند لرفعه.",
        unexpectedError:
          "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      },

      status: {
        pending: "بانتظار الموافقة",
        approved: "تمت الموافقة",
        rejected: "مرفوض",
      },

      manager: {
        approve: "موافقة",
        reject: "رفض",
        rejectionComment: "سبب الرفض",
        rejectionRequired: "يرجى كتابة سبب الرفض.",
        reviewDocuments: "مراجعة المستندات",
      },

      language: {
        english: "English",
        arabic: "العربية",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const updateDocumentDirection = (language: string) => {
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
};

updateDocumentDirection(i18n.language);

i18n.on("languageChanged", updateDocumentDirection);

export default i18n;
