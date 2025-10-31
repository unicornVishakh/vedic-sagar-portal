const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy for Veda Vogue</h1>
          <p className="text-sm text-muted-foreground">Last updated: October 31, 2025</p>
        </div>

        <div className="space-y-6 text-foreground/90">
          <p>
            Welcome to Veda Vogue ("we," "our," "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application (the "App").
          </p>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
            <p>
              We collect personal information that you voluntarily provide to us when you use specific features of our App.
            </p>
            <p>The personal information we collect includes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Name (First and Last):</strong> Collected when you fill out our "Donation Interest" form or our "Contact Us" form.
              </li>
              <li>
                <strong>Email Address:</strong> Collected when you fill out our "Donation Interest" form or our "Contact Us" form.
              </li>
              <li>
                <strong>Phone Number:</strong> Collected when you fill out our "Donation Interest" form.
              </li>
            </ul>
            <p>
              We do not collect any other personal information, financial information (like credit card numbers), or sensitive data directly through the App.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect solely for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>To Respond to Your Requests:</strong> To contact you regarding your interest in making a donation, as submitted through our "Donation Interest" form.
              </li>
              <li>
                <strong>To Provide User Support:</strong> To respond to your questions or inquiries submitted through our "Contact Us" form.
              </li>
            </ul>
            <p>We do not use your personal information for marketing or advertising purposes.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">3. Data Sharing and Third Parties</h2>
            <p>We do not sell or rent your personal information to any third parties.</p>
            <p>
              We share your information only with the following third-party service provider for the purpose of app functionality:
            </p>
            <p>
              <strong>Supabase:</strong> We use Supabase as our backend and database provider. The information you submit through our forms (Name, Email, Phone Number, Message) is sent to and stored securely in our Supabase database so that we can access it to fulfill your request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
            <p>We are committed to protecting your data. We implement the following security measures:</p>
            <p>
              <strong>Encryption in Transit:</strong> All user data collected by our App is encrypted in transit using secure Transport Layer Security (TLS) when it is sent to our Supabase backend.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">5. Data Retention (Not Processed Ephemerally)</h2>
            <p>
              The data you submit is not processed ephemerally. We retain the personal information collected through our forms in our database so that we can maintain a record of donation interests and contact submissions, and to follow up with you as requested.
            </p>
            <p>
              You can request the deletion of your personal data by contacting us at vedavoguearyasamaj@gmail.com.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">6. Children's Privacy</h2>
            <p>
              Our App is intended for a general audience, with a target age group of 18 and older, particularly for features like expressing interest in donations. We do not knowingly collect any personal information from children under the age of 13.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy within the App.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: vedavoguearyasamaj@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
