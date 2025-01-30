import Navbar from '@/components/Navigation/Navbar';

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information that you provide directly to us, information we obtain automatically when you use our services, and information from other sources. This includes:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Personal identification information (name, email address, etc.)</li>
                        <li>Usage data and analytics</li>
                        <li>Device and connection information</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">2. How We Use Your Information</h2>
                    <p>We use the collected information for various purposes, including:</p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Providing and maintaining our services</li>
                        <li>Improving user experience</li>
                        <li>Sending notifications and updates</li>
                        <li>Customer support</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">3. Information Sharing</h2>
                    <p>
                        We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>With your consent</li>
                        <li>For legal requirements</li>
                        <li>To protect our rights and safety</li>
                    </ul>

                    <h2 className="text-xl font-semibold mt-6 mb-4">4. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:{' '}
                        <a href="mailto:busdev@zbshareware.com" className="text-blue-600 hover:text-blue-800">
                            busdev@zbshareware.com
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
} 