import en from './en'

export interface LocaleType {
  metadata: {
    title: string
    description: string
  }
  
  // 统一的工具定义
  toolsbar: {
    mergePdf: {
      title: string
      description: string
    }
    splitPdf: {
      title: string
      description: string
    }
    compressPdf: {
      title: string
      description: string
    }
    pdfToWord: {
      title: string
      description: string
    }
    pdfToPpt: {
      title: string
      description: string
    }
    pdfToExcel: {
      title: string
      description: string
    }
    wordToPdf: {
      title: string
      description: string
    }
    powerPointToPdf: {
      title: string
      description: string
    }
    excelToPdf: {
      title: string
      description: string
    }
    editPdf: {
      title: string
      description: string
    }
    // 新增的工具
    pdfToJpg: {
      title: string
      description: string
    }
    deletePages: {
      title: string
      description: string
    }
    jpgToPdf: {
      title: string
      description: string
    }
    extractPages: {
      title: string
      description: string
    }
    rotatePdf: {
      title: string
      description: string
    }
    ocrPdf: {
      title: string
      description: string
    }
    annotatePdf: {
      title: string
      description: string
    }

    signPdf: {
      title: string
      description: string
    }
    pageNumberPdf: {
      title: string
      description: string
    }
    watermarkPdf: {
      title: string
      description: string
    }
    encryptPdf: {
      title: string
      description: string
    }
    unlockPdf: {
      title: string
      description: string
    }
  }

  home: {
    title: string
    description: string
    buttons: {
      startTrial: string
      exploreTools: string
    }
    toolsSection: {
      title: string
      subtitle: string
    }
  }

  nav: {
    tools: string
    compress: string
    convert: string
    merge: string
    pricing: string
    login: string
    freeTrial: string
    categories: {
      optimize: string
      convertFromPdf: string
      organize: string
      edit: string
      convertToPdf: string
      encrypt: string
    }
  }

  tools: {
    
    organizePdf: {
      title: string
      description: string
      features: {
        merge: string
        split: string
        delete: string
      }
    }
    deletePages: {
      title: string
      description: string
      selectMultiple: string
      downloadInfo: string
      totalPages: string
      removeSelected: string
    }

    compressPdf: {
      title: string;
      description: string;
      compressionComplete: string;
      originalSize: string;
      compressedSize: string;
      compressionRatio: string;
      compressionQuality: string;
      mediumCompression: string;
      highCompression: string;
      compressButton: string;
      processingMessage: string;
      compressionError: string;
      cannotCompress: string;
    }

    splitPages: {
      title: string;
      description: string;
      selectSplitPoints: string;
      downloadInfo: string;
      totalPages: string;
      splitPoints: string;
      splitButton: string;
      processingMessage: string;
    }

    extractPages: {
      title: string
      description: string
      selectPages: string
      downloadInfo: string
      totalPages: string
      selectedPages: string
      mergeOption: string
      extractButton: string
      processingMessage: string
    }

    rotatePdf: {
      title: string
      description: string
      totalPages: string
      rotateButton: string
      processingMessage: string
      downloadInfo: string
      saveAndDownload: string
    }

    fileUploader: {
      dropToUpload: string
      dragOrClick: string
      multipleFiles: string
      singleFile: string
    }

    mergePages: {
      title: string
      description: string
      selectFiles: string
      downloadInfo: string
      totalFiles: string
      mergeButton: string
      processingMessage: string
      dragToReorder: string
    }

    ocrPdf: {
      title: string
      description: string
      selectLanguage: string
    }

    annotator: {
      openFile: string
      edit: string
      save: string
    }

    annotatePdf: {
      title: string
      description: string
    }

    signPdf: {
      title: string
      description: string
    }

    watermarkPdf: {
      title: string
      description: string
      settings: {
        addWatermark: string
        settings: string
        watermarkText: string
        fontSize: string
        color: string
        opacity: string
        rotation: string
        processing: string
      }
    }

    pageNumberPdf: {
      title: string
      description: string
      processing: string
      addPageNumbers: string
    }

    encryptPdf: {
      title: string
      description: string
      password: string
      confirmPassword: string
      passwordMismatch: string
      passwordRequired: string
      processing: string
      downloadEncrypted: string
    }

    unlockPdf: {
      title: string
      description: string
      password: string
      passwordRequired: string
      wrongPassword: string
      processing: string
      downloadDecrypted: string
    }
  }

  auth: {
    // LoginModal
    loginToAccount: string
    loginWithGoogle: string
    loginWithMicrosoft: string
    
    // UserMenu
    becomeMember: string
    expiryDate: string
    logout: string
    memberBenefits: string
    unlimitedAccess: string
    officeConversion: string
    cloudStorage: string
    prioritySupport: string
  }

  fileUpload: {
    dropToUpload: string
    dragOrClick: string
    supportedFiles: string
  }

  convert: {
    status: {
      uploading: string
      converting: string
      downloading: string
      error: string,
      convertSuccess: string
    }
    button: {
      convertAndDownload: string
    }
  }

  upgrade: {
    reasons: {
      fileSize: string
      dailyLimit: string
      monthlyLimit: string
      expired: string
    }
    benefits: string[]
    upgradeButton: string
  }

  errors: {
    auth: {
      reloginRequired: string
    }
    subscription: {
      monthlyLimitReached: string
      dailyLimitReached: string
      fileSizeLimit: string
      userNotFound: string
      decreaseUsageError: string
    }
  }

  pricing: {
    title: string
    description: string
    billingToggle: {
      monthly: string
      yearly: string
      savePercent: string
    }
    plans: {
      free: {
        title: string
        price: string
        features: string[]
        button: string
      }
      premium: {
        title: string
        price: {
          monthly: string
          yearly: string
          perMonth: string
          totalPerYear: string
        }
        features: string[]
        button: string
      }
      business: {
        title: string
        price: {
          custom: string
          subtitle: string
        }
        description: string
        features: string[]
        button: string
      }
    }
  }

  settings: {
    title: string
    basicInfo: string
    email: string
    account: string
    usage: string
    monthlyQuota: string
    convertedCount: string
    becomeVip: string
    manageSubscription: string
    expiryDate: string
  }
}

// 可以添加工具类型的辅助类型定义
export type ToolKeys = keyof LocaleType['toolsbar'] 