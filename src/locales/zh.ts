export default {
  metadata: {
    title: "PDF 工具 - 让 PDF 处理更简单",
    description: "专业的 PDF 工具，为所有人服务"
  },
  toolsbar: {
    mergePdf: {
      title: "合并PDF",
      description: "通过直观的合并工具，按照您的需求将多个文件组合成单个PDF。"
    },
    splitPdf: {
      title: "拆分PDF",
      description: "提取PDF中的单页或章节，生成独立的新文档。"
    },
    compressPdf: {
      title: "压缩PDF",
      description: "智能压缩文件大小，同时保持最佳文档质量。"
    },
    pdfToWord: {
      title: "PDF转Word",
      description: "将PDF内容转换为可编辑的Word文档，同时保持原有格式。"
    },
    pdfToPpt: {
      title: "PDF转PPT",
      description: "将PDF内容转换为可编辑的PowerPoint演示文稿。"
    },
    pdfToExcel: {
      title: "PDF转Excel",
      description: "快速将PDF表格和数据转换为Excel格式，便于分析使用。"
    },
    wordToPdf: {
      title: "Word转PDF",
      description: "将Word文档转换为通用的PDF格式，确保文档的通用性。"
    },
    powerPointToPdf: {
      title: "PowerPoint转PDF",
      description: "将演示文稿转换为PDF格式，确保在各种设备上显示一致。"
    },
    excelToPdf: {
      title: "Excel转PDF",
      description: "将电子表格转换为专业的PDF文档，方便分享传阅。"
    },
    editPdf: {
      title: "编辑PDF",
      description: "实时为PDF添加文本、图形和手写批注，实现个性化定制。"
    },
    pdfToJpg: {
      title: "PDF转JPG",
      description: "将PDF页面转换为JPG图片格式。"
    },
    deletePages: {
      title: "删除页面",
      description: "从PDF文档中删除不需要的页面。"
    },
    jpgToPdf: {
      title: "JPG转PDF",
      description: "将JPG图片转换为PDF格式。"
    },
    extractPages: {
      title: "提取页面",
      description: "从 PDF 文档中提取选定的页面，生成新的 PDF 文件"
    },
    rotatePdf: {
      title: "旋转PDF",
      description: "旋转 PDF 文档中的页面到所需方向"
    },
    ocrPdf: {
      title: "PDF OCR",
      description: "将扫描的PDF文档转换为可搜索、可复制的PDF文件，支持多语言识别"
    },
    annotatePdf: {
      title: "注释PDF",
      description: "打开PDF文件，添加注释、标记和评论，轻松完成文档审阅。所有处理在本地完成，无需上传文件。"
    },
    signPdf: {
      title: "PDF签名",
      description: "在PDF文档上添加手写签名，图片印章或者文字签名"
    },
    pageNumberPdf: {
      title: "添加页码",
      description: "为PDF文档添加页码，轻松组织和引用文档内容"
    },
    watermarkPdf: {
      title: "添加水印",
      description: "在PDF文档中添加水印，以保护文档内容"
    },
    encryptPdf: {
      title: "加密PDF",
      description: "为PDF文件添加密码保护，确保文档安全"
    },
    unlockPdf: {
      title: "解密PDF",
      description: "移除PDF文件的密码保护"
    } 
  },
  home: {
    title: "让PDF处理变得简单",
    description: "为您提供提升文档处理效率的智能工具",
    buttons: {
      startTrial: "免费试用",
      exploreTools: "探索所有PDF工具"
    },
    toolsSection: {
      title: "专业PDF工具，随时待命",
      subtitle: "立即使用我们全面的PDF工具套件。所有功能完全免费且操作简单！轻松处理PDF文件 - 从合并拆分到压缩转换，一应俱全。"
    }
  },
  nav: {
    tools: "工具",
    compress: "压缩",
    convert: "转换",
    merge: "合并",
    pricing: "定价",
    login: "登录",
    freeTrial: "免费试用",
    categories: {
      optimize: "优化PDF",
      convertFromPdf: "从PDF转换",
      organize: "整理",
      edit: "编辑",
      convertToPdf: "转换为PDF",
      encrypt: "加密"
    }
  },
  tools: {
    // ... 其他工具翻译
    organizePdf: {
      title: "整理PDF",
      description: "轻松合并、拆分或删除PDF文档中的页面",
      features: {
        merge: "将多个PDF合并为一个文档",
        split: "将PDF拆分为多个文档",
        delete: "从PDF中删除不需要的页面"
      }
    },
    deletePages: {
      title: "删除页面",
      description: "从PDF文档中删除不需要的页面",
      selectMultiple: "你可以一次选择多个页面",
      downloadInfo: "当你点击删除按钮后会自动下载删除后的PDF文件，原来的文件不会被修改。",
      totalPages: "总页面数",
      removeSelected: "删除选中页面"
    },
    compressPdf: {
      title: "压缩PDF文件",
      description: "在线压缩PDF文件，快速减小文件大小，方便分享和存储",
      compressionComplete: "压缩完成！",
      originalSize: "原始大小",
      compressedSize: "压缩大小",
      compressionRatio: "压缩比率",
      compressionQuality: "压缩质量",
      mediumCompression: "中等压缩（推荐）",
      highCompression: "高压缩（最小文件）",
      compressButton: "压缩PDF",
      processingMessage: "PDF文件正在处理...",
      compressionError: "如果在压缩过程中出现错误，请尝试使用不同的PDF文件或降低压缩质量",
      cannotCompress: "此PDF文件无法进一步压缩，可能是因为：\n1. 文件已被压缩\n2. 文件主要包含文本。"
    },
    splitPages: {
      title: "拆分PDF",
      description: "通过选择拆分点将PDF文档拆分为多个文件",
      selectSplitPoints: "你可以选择多个拆分点",
      downloadInfo: "当你点击拆分按钮后，所有部分将自动下载。原始文件不会被修改。",
      totalPages: "总页数",
      splitPoints: "拆分点数",
      splitButton: "拆分PDF",
      processingMessage: "PDF文件正在处理..."
    },
    extractPages: {
      title: "提取 PDF 页面",
      description: "从 PDF 文档中提取选定的页面，可以选择合并为一个新的 PDF 文件或单独保存",
      selectPages: "选择要提取的页面",
      downloadInfo: "勾选需要提取的页面，可以选择合并为一个PDF文件或单独保存每一页",
      totalPages: "总页数",
      selectedPages: "已选择",
      mergeOption: "合并为一个PDF文件",
      extractButton: "提取选中页面",
      processingMessage: "正在处理中..."
    },
    rotatePdf: {
      title: "旋转PDF",
      description: "将PDF文档中的页面旋转到所需方向",
      totalPages: "总页数",
      rotateButton: "点击顺时针旋转90°",
      processingMessage: "PDF文件正在处理中...",
      downloadInfo: "点击保存按钮后，修改后的PDF将自动下载。原始文件不会被修改。",
      saveAndDownload: "保存并下载"
    },
    fileUploader: {
      dropToUpload: "松开鼠标以加载文件",
      dragOrClick: "拖放PDF文件或点击选择文件",
      multipleFiles: "支持最多 ${maxFiles} 个PDF文件，所有处理在本地完成，无需上传",
      singleFile: "支持单个PDF文件，所有处理在本地完成，无需上传"
    },
    mergePages: {
      title: "合并 PDF 文件",
      description: "将多个 PDF 文件合并成一个 PDF 文档",
      selectFiles: "合并 PDF 文件",
      downloadInfo: "拖动缩略图可以调整合并顺序",
      totalFiles: "已选择文件数",
      mergeButton: "合并 PDF",
      processingMessage: "正在处理中...",
      dragToReorder: "拖动调整顺序 #"
    },
    ocrPdf: {
      title: "PDF OCR - 将扫描PDF转换为可搜索文档",
      description: "将扫描的PDF文档转换为可搜索、可复制的PDF文件，支持中英文识别",
      selectLanguage: "选择识别语言（可多选）"
    },
    annotator: {
      openFile: "打开文件",
      edit: "编辑",
      save: "保存"
    },
    annotatePdf: {
      title: "注释PDF",
      description: "打开PDF文件，添加注释、标记和评论，轻松完成文档审阅。所有处理在本地完成，无需上传文件。"
    },
    signPdf: {
      title: "PDF签名",
      description: "在PDF文档上添加手写签名，图片印章或者文字签名"
    },
    watermarkPdf: {
      title: "添加水印",
      description: "在PDF文档中添加水印，以保护文档内容",
      settings: {
        addWatermark: "添加水印",
        settings: "设置",
        watermarkText: "水印文本",
        fontSize: "字体大小",
        color: "颜色",
        opacity: "透明度",
        rotation: "旋转角度",
        processing: "处理中..."
      }
    },
    pageNumberPdf: {
      title: "添加页码",
      description: "为PDF文档添加页码，轻松组织和引用文档内容",
      processing: "正在处理中...",
      addPageNumbers: "添加页码"
    },
    encryptPdf: {
      title: "加密PDF",
      description: "为PDF文件添加密码保护，确保文档安全",
      password: "密码",
      confirmPassword: "确认密码",
      passwordMismatch: "两次输入的密码不一致",
      passwordRequired: "请输入密码",
      processing: "正在处理中...",
      downloadEncrypted: "下载加密后的PDF"
    },
    unlockPdf: {
      title: "解密PDF",
      description: "移除PDF文件的密码保护",
      password: "密码",
      passwordRequired: "请输入密码",
      wrongPassword: "密码错误，请重试",
      processing: "正在处理中...",
      downloadDecrypted: "下载解密后的PDF"
    }
  },
  auth: {
    loginToAccount: "登录到您的账户",
    loginWithGoogle: "使用谷歌账户登录",
    loginWithMicrosoft: "使用微软账户登录",
    
    becomeMember: "成为会员",
    expiryDate: "过期日期：",
    logout: "注销",
    memberBenefits: "会员权益",
    unlimitedAccess: "无限使用所有基础功能",
    officeConversion: "PDF和Office文件格式互转",
    cloudStorage: "云端存储文件",
    prioritySupport: "优先客户支持"
  },
  fileUpload: {
    dropToUpload: "释放文件以上传",
    dragOrClick: "拖放文件或点击上传",
    supportedFiles: "支持上传PDF、Office文档(Word/Excel/PPT)和图片文件"
  },
  convert: {
    status: {
      uploading: "正在上传文件...",
      converting: "正在转换文件...",
      downloading: "准备下载...",
      error: "转换文件失败",
      convertSuccess: "转换文件成功！"
    },
    button: {
      convertAndDownload: "转换并下载"
    }
  },
  upgrade: {
    reasons: {
      fileSize: '免费用户大支持5MB的文件转换',
      dailyLimit: '今日免费使用次数已达到限制',
      monthlyLimit: '本月转换以及其它高级功能使用次数已用完',
      expired: '您的订阅已过期'
    },
    benefits: [
      '可以使用全部的功能',
      '不受限制的文件大小',
      '更多的文件处理次数',
      '无广告',
      '优先的客户服务'
    ],
    upgradeButton: '立即升级'
  },
  errors: {
    auth: {
      reloginRequired: "请注销账号后重新登录"
    },
    subscription: {
      monthlyLimitReached: "本月转换次数已用完",
      dailyLimitReached: "免费用户的每日转换次数已用完",
      fileSizeLimit: "文件大小超过5MB限制",
      userNotFound: "用户不存在",
      decreaseUsageError: "减少用户使用量时出错:"
    }
  },
  pricing: {
    title: "简单的定价方案",
    description: "选择最适合您需求的方案",
    billingToggle: {
      monthly: "月付",
      yearly: "年付",
      savePercent: "-20%"
    },
    plans: {
      free: {
        title: "免费版",
        price: "免费",
        features: [
          "免费使用各种基本工具",
          "每日可以转换1个文档",
          "最大支持5MB文件转换"
        ],
        button: "开始使用"
      },
      premium: {
        title: "高级版",
        price: {
          monthly: "月付",
          yearly: "年付",
          perMonth: "/月",
          totalPerYear: "年付账单金额"
        },
        features: [
          "免费使用所有工具",
          "高质量转换文档，保持文档原有格式",
          "最大支持500MB文件转换",
          "每月可以转换100个文档"
        ],
        button: "升级到高级版"
      },
      business: {
        title: "企业版",
        price: {
          custom: "定制价格",
          subtitle: "为您的企业定制方案"
        },
        description: "商业版包含所有 高级版 功能，外加：",
        features: [
          "灵活的付款方式",
          "根据需求每月可以转换更多文档",
          "优先客户支持"
        ],
        button: "联系销售"
      }
    }
  },
  settings: {
    title: "设置",
    basicInfo: "基本信息",
    email: "邮箱",
    account: "账户",
    usage: "使用量",
    monthlyQuota: "每月转换文件次数",
    convertedCount: "您已转换 ${usedCount} 个文件",
    becomeVip: "成为会员",
    manageSubscription: "管理订阅",
    expiryDate: "过期日期"
  }
} as const 