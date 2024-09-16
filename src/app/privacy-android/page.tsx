import { H1 } from '@/components/ui/H1';
import { H2 } from '@/components/ui/H2';
import { Metadata } from 'next';
import { APP_NAME, AI_MODEL_NAME } from '../../../constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const DEVELOPER_DOMAIN = 'turskyi.com';
const updateDate = 'September 2024';

export default function Page() {
  return (
    <section className="space-y-6">
      <div className="container mx-auto p-4 mt-6 space-y-6">
        <div className="space-y-3">
          <H1>Privacy Policy For &quot;{APP_NAME}&quot; Android App</H1>
          <p>Last Updated: {updateDate}</p>
        </div>
        <div className="space-y-3">
          <H2>Introduction</H2>
          <p>
            Welcome to the {APP_NAME} Android mobile application. This Privacy
            Policy outlines our practices regarding the collection, use, and
            disclosure of information that we receive through our app. Our
            primary goal is to provide you with an interactive AI experience
            while respecting your privacy.
          </p>
          <H2>Information We Collect</H2>
          <p>
            The app does not collect any personal data from users. No account
            creation is required, and we do not track users or collect personal
            data. The only information used is the user&apos;s input, which is
            sent to the {AI_MODEL_NAME} model to generate responses. The
            specifics of how the model processes this data are not disclosed to
            us.
          </p>
          <H2>Use of Information</H2>
          <p>
            The user input we collect is used solely for the purpose of
            generating responses within the app.
          </p>
          <H2>Information Sharing and Disclosure</H2>
          <p>
            We do not sell, trade, or rent users&apos; personal identification
            information to others. We do not share any information with third
            parties.
          </p>
          <H2>Security</H2>
          <p>
            The security of your information is important to us. Please note
            that no method of transmission over the Internet, or method of
            electronic storage, is 100% secure. While we strive to use
            commercially acceptable means to protect your information, we cannot
            guarantee its absolute security.
          </p>
          <H2>Changes to This Privacy Policy</H2>
          <p>
            This Privacy Policy is effective as of {updateDate} and will remain
            in effect except with respect to any changes in its provisions in
            the future, which will be in effect immediately after being posted
            on this page. We reserve the right to update or change our Privacy
            Policy at any time, and you should check this Privacy Policy
            periodically.
          </p>
          <H2>Contact Us</H2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at{' '}
            <a href={`mailto:support@${DEVELOPER_DOMAIN}`}>
              support@{DEVELOPER_DOMAIN}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
