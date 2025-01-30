import Navbar from '@/components/Navigation/Navbar';

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 py-8 max-w-4xl overflow-y-auto">
                <div className="prose prose-lg max-w-none">
                    <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-4">1. Introduction</h2>
                    <p>
                        Welcome to the services provided by Zbshareware(hereinafter referred to as "we," "us," or "Zbshareware"). 
                        These services include our website, applications, software, products, and any other online or offline services 
                        (collectively referred to as the "Services"). By using our Services, you agree to be bound by the following 
                        terms and conditions (the "Terms of Service").
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">2. Acceptance of Terms of Service</h2>
                    <p>
                        Use of our Services indicates your agreement to these Terms of Service. If you do not agree to these terms, 
                        please do not use our Services. We reserve the right to modify these Terms of Service at any time, so please 
                        review them periodically for updates.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">3. Service Description</h2>
                    <p>
                        Zbshareware provides services including but not limited to artificial intelligence assistants, data analysis, 
                        machine learning models, and more. We strive to deliver high-quality services, but the availability and 
                        performance of the Services may be affected by various factors.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">4. User Eligibility</h2>
                    <p>
                        You must be at least 18 years old to use our Services. If you are under the age of 18, please do not use our Services.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">5. Fees</h2>
                    <p>
                        Our Services may include both free and paid components. For paid services, we will clearly state the fee 
                        structure and provide detailed cost information before you purchase the Services.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">6. User Conduct</h2>
                    <p>
                        When using our Services, you agree not to engage in any illegal activities, infringe upon the intellectual 
                        property rights of others, or undertake any actions that may harm the Services.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">7. Copyright and Intellectual Property</h2>
                    <p>
                        Zbshareware owns all copyrights and other intellectual property rights in the content of the Services, 
                        unless otherwise indicated. Without our prior written permission, you may not copy, modify, distribute, 
                        or use the content in any other way.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">8. Privacy Policy</h2>
                    <p>
                        We respect your privacy. Our Privacy Policy details how we handle your personal information. You can review 
                        our Privacy Policy on our website.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">9. Disclaimer</h2>
                    <p>
                        Zbshareware provides the Services "as is" without any form of warranty. We do not guarantee that the Services 
                        will meet your requirements, be uninterrupted, timely, secure, or error-free.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">10. Limitation of Liability</h2>
                    <p>
                        Under no circumstances shall Zbshareware be liable for any direct, indirect, incidental, special, punitive, 
                        or consequential damages (including but not limited to lost profits, business interruption, loss of data, etc.), 
                        whether based on contract, tort, or any other legal theory.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">11. Dispute Resolution</h2>
                    <p>
                        Any disputes arising from the use of our Services shall be submitted to the competent court in the primary 
                        place of business of Zbshareware.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">12. Modification and Termination</h2>
                    <p>
                        We reserve the right to modify or terminate the Services at any time without notice. We may also modify 
                        these Terms of Service at any time.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">13. Complete Agreement</h2>
                    <p>
                        These Terms of Service, together with our Privacy Policy and any other relevant policies or guidelines, 
                        constitute the entire agreement between you and Zbshareware.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">14. Refund Eligibility</h2>
                    <p>
                    We are confident in our services and offer a 7-day money-back guarantee. If you are not completely satisfied with our services, you can request a full refund within 7 days of your purchase.
                    </p>

                    <h2 className="text-xl font-semibold mt-6 mb-4">15. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms of Service or require further information, please contact us at:{' '}
                        <a href="mailto:busdev@zbshareware.com" className="text-blue-600 hover:text-blue-800">
                            busdev@zbshareware.com
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}