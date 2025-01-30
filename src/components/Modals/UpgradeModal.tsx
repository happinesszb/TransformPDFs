import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { useLocale } from '@/hooks/useLocale';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: 'fileSize' | 'dailyLimit' | 'monthlyLimit' | 'expired';
}

export default function UpgradeModal({ isOpen, onClose, reason }: UpgradeModalProps) {
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  const getReasonTitle = () => {
    return t.upgrade.reasons[reason];
  };


  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-50 w-[400px]">
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-6">
          {getReasonTitle()}
        </h2>

        <Link 
          href={`/pricing`}
          className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 mb-6"
        >
          {t.upgrade.upgradeButton}
        </Link>

        <div className="space-y-3">
          {t.upgrade.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 