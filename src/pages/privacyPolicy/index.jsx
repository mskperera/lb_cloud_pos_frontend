import React, { useState } from 'react';

const PrivacyPolicy = () => {
  const [activeTab, setActiveTab] = useState('english'); // Default to English tab

  return (
    <div className="bg-base-100 min-h-screen py-10 text-lg">
      <div className="container mx-auto px-4">
      

        {/* Tabs */}
        <div className="tabs tabs-boxed mb-6 flex justify-center bg-base-100">
          <button
            className={`tab ${activeTab === 'english' ? 'tab-active' : ''} text-lg`}
            onClick={() => setActiveTab('english')}
          >
            English
          </button>
          <button
            className={`tab ${activeTab === 'sinhala' ? 'tab-active' : ''} text-lg`}
            onClick={() => setActiveTab('sinhala')}
          >
            Sinhala (සිංහල)
          </button>
        </div>

        {/* Content */}
        <div className="bg-base-100 shadow-xl rounded-lg p-6">
          {/* English Version */}
          {activeTab === 'english' && (
            <div>
                {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8">
          Privacy Policy for SkyCrown Cloud POS System
        </h1>
              {/* Introduction */}
              <p className="text-lg mb-6">
                This privacy policy outlines how <strong>Legendbyte</strong> collects, uses, discloses, and manages your data when you use our cloud-based Point of Sale (POS) system. We are committed to protecting your privacy and ensuring that your data is handled securely and in accordance with applicable laws.
              </p>

              {/* Data Collected */}
              <h2 className="text-2xl font-semibold mb-4">Data Collected</h2>
              <p className="mb-2">
                When you use our cloud POS system, we collect data from you, which may include:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4">
                <li>Your business information: Name, address, contact details, financial information, etc.</li>
                <li>Data related to your operations: Employee data, inventory data, sales data, etc.</li>
                <li>Customer data: Names, addresses, contact information, payment details, purchase history, etc., as provided by you for managing your business operations.</li>
              </ul>
              <p className="mb-6">
                The customer data you provide to us remains your property, and we are merely processing it on your behalf to provide our services. We will not use or disclose this data for any purpose other than to provide our services to you, unless required by law. We collect this data to provide our services to you and to help you manage your business effectively.
              </p>

              {/* How We Use Your Data */}
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Data</h2>
              <p className="mb-2">We use the data collected to:</p>
              <ul className="list-disc list-inside ml-4 mb-6">
                <li>Provide and maintain our cloud POS system services.</li>
                <li>Process transactions and manage sales data.</li>
                <li>Improve our services and develop new features.</li>
                <li>Communicate with you about your account and our services.</li>
                <li>Comply with legal and regulatory requirements.</li>
              </ul>

              {/* Data Security */}
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="mb-2">
                We take the security of your data seriously. We have implemented various security measures to protect your data from unauthorized access, alteration, or disclosure. These measures include:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4">
                <li>Encryption of data both in transit and at rest.</li>
                <li>Regular security auditing and vulnerability testing.</li>
                <li>Access controls to ensure only authorized personnel can access your data.</li>
                <li>Compliance with industry standards such as PCI DSS for handling payment card information.</li>
              </ul>
              <p className="mb-6">
                Each business's data is stored in a separate, isolated database or partition to prevent any unauthorized access or mixing of data between different clients.
              </p>

              {/* Data Sharing */}
              <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
              <p className="mb-2">
                We do not disclose your data to other parties without your explicit consent, except in the following circumstances:
              </p>
              <ol className="list-decimal list-inside ml-4 mb-4">
                <li>To provide our services to you, such as processing payments through payment gateways or integrating with other business tools.</li>
                <li>To comply with legal obligations or respond to valid legal requests.</li>
                <li>To protect our rights, property, or safety, or that of our users or the public.</li>
              </ol>
              <p className="mb-6">
                When sharing your customers' data with third parties to provide our services, we will ensure that such third parties handle the data in accordance with your instructions and applicable data protection laws. We do not sell, rent, or share your data with third parties for marketing purposes without your explicit consent.
              </p>

              {/* Your Rights */}
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-6">
                As a business user, you have the right to access, correct, or delete your data that we hold. This includes your business information and the data of your customers that you have provided to us. To exercise these rights, please contact us using the information provided below. Additionally, if your customers request access to, correction of, or deletion of their data, you are responsible for handling those requests in accordance with applicable laws. We will provide you with the necessary tools and support to manage such requests through our system.
              </p>

              {/* Data Retention */}
              <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
              <p className="mb-6">
                We retain your data for as long as necessary to provide our services to you or as required by law. Once your account is closed and all contractual obligations are met, we will delete your data in accordance with our data retention policies.
              </p>

              {/* Cookies and Tracking Technologies */}
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p className="mb-6">
                Our system may use cookies or other tracking technologies for purposes such as session management, authentication, and analytics to improve our services. These technologies do not collect personally identifiable information unless you have provided such information to us. You can manage your cookie preferences through your browser settings.
              </p>

              {/* International Data Transfers */}
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="mb-6">
                Your data may be stored and processed in [country/region], or in any other country where we have operations or use third-party service providers. We will take appropriate measures to ensure that your data is protected in accordance with this privacy policy and applicable laws. If you are located in a region with specific data protection regulations (such as the European Economic Area), we will ensure that any transfer of your data outside of that region is done in compliance with those regulations.
              </p>

              {/* Data Breach Notification */}
              <h2 className="text-2xl font-semibold mb-4">Data Breach Notification</h2>
              <p className="mb-6">
                In the event of a security breach or unauthorized access to your data, we will notify you as soon as possible and take appropriate steps to investigate and remediate the issue. We will also comply with any legal requirements for notifying affected individuals or regulatory authorities.
              </p>

              {/* Complaints and Concerns */}
              <h2 className="text-2xl font-semibold mb-4">Complaints and Concerns</h2>
              <p className="mb-6">
                If you have any complaints or concerns about our data handling practices, please contact us using the information provided below. We will investigate and address your concerns in a timely manner.
              </p>

              {/* Contact Us */}
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-2">
                If you have any questions or concerns about this privacy policy or our data practices, please contact our privacy officer at:
              </p>
              <ul className="list-none ml-4 mb-6">
                <li>Email: legendbyteworld@gmail.com</li>
                {/* <li>Phone: xxxxxxx</li> */}
                {/* <li>Mailing address: [address]</li> */}
              </ul>

              {/* Policy Updates */}
              <h2 className="text-2xl font-semibold mb-4">Policy Updates</h2>
              <p className="mb-6">
                We may update this privacy policy from time to time to reflect changes in our data practices or legal requirements. We will notify you of any significant changes by posting the updated policy on our website or through other communication channels.
              </p>
            </div>
          )}

          {/* Sinhala Version */}
          {activeTab === 'sinhala' && (
            <div>
                {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-8">
        SkyCrown Cloud POS පද්ධතිය සඳහා රහස්‍යතා ප්‍රතිපත්තිය
        </h1>
              {/* Introduction */}
              <p className="text-lg mb-6">
                මෙම රහස්‍යතා ප්‍රතිපත්තියෙන් <strong>Legendbyte</strong> විසින් අපගේ වලාකුළු මත පදනම් වූ විකුණුම් ස්ථාන (POS) පද්ධතිය භාවිතා කරන විට ඔබේ දත්ත එකතු කරන, භාවිතා කරන, හෙළිදරව් කරන සහ කළමනාකරණය කරන ආකාරය පිළිබඳව විස්තර කෙරේ. ඔබේ රහස්‍යතාව ආරක්ෂා කිරීමට සහ ඔබේ දත්ත ආරක්ෂිතව හසුරුවන බවට සහතික කිරීමට අපි කැපවී සිටිමු.
              </p>

              {/* Data Collected */}
              <h2 className="text-2xl font-semibold mb-4">එකතු කරන දත්ත</h2>
              <p className="mb-2">
                ඔබ අපගේ Cloud POS පද්ධතිය භාවිතා කරන විට, අපි ඔබෙන් දත්ත එකතු කරනවා, එයට ඇතුළත් විය හැක:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4">
                <li>ඔබේ ව්‍යාපාරික තොරතුරු: නම, ලිපිනය, සම්බන්ධතා තොරතුරු, මූල්‍ය තොරතුරු ආදිය.</li>
                <li>ඔබේ මෙහෙයුම් සම්බන්ධ දත්ත: සේවක දත්ත, භාණ්ඩ තොග දත්ත, විකුණුම් දත්ත ආදිය.</li>
                <li>පාරිභෝගික දත්ත: නම්, ලිපින, සම්බන්ධතා තොරතුරු, ගෙවීම් විස්තර, මිලදී ගැනීමේ ඉතිහාසය ආදිය, ඔබ විසින් ඔබේ ව්‍යාපාරික මෙහෙයුම් කළමනාකරණය සඳහා ලබා දී ඇති පරිදි.</li>
              </ul>
              <p className="mb-6">
                ඔබ අපට ලබා දෙන පාරිභෝගික දත්ත ඔබේ දේපළ ලෙස පවතින අතර, අපි එය ඔබ වෙනුවෙන් සේවාවන් සැපයීම සඳහා පමණක් සකසනවා. නීතියෙන් අවශ්‍ය නොවන්නේ නම්, අපගේ සේවාවන් සැපයීම හැර වෙනත් කිසිදු අරමුණකට මෙම දත්ත භාවිතා කිරීමට හෝ හෙළිදරව් කිරීමට අපි කටයුතු නොකරනවා. ඔබට අපගේ සේවාවන් සැපයීමට සහ ඔබේ ව්‍යාපාරය ඵලදායී ලෙස කළමනාකරණය කිරීමට සහාය වීමට අපි මෙම දත්ත එකතු කරනවා.
              </p>

              {/* How We Use Your Data */}
              <h2 className="text-2xl font-semibold mb-4">අපි ඔබේ දත්ත භාවිතා කරන ආකාරය</h2>
              <p className="mb-2">අපි එකතු කරන දත්ත භාවිතා කරන්නේ:</p>
              <ul className="list-disc list-inside ml-4 mb-6">
                <li>අපගේ Cloud POS පද්ධති සේවාවන් සැපයීමට සහ පවත්වාගෙන යාමට.</li>
                <li>ගනුදෙනු සැකසීමට සහ විකුණුම් දත්ත කළමනාකරණය කිරීමට.</li>
                <li>අපගේ සේවාවන් වැඩිදියුණු කිරීමට සහ නව විශේෂාංග සංවර්ධනය කිරීමට.</li>
                <li>ඔබේ ගිණුම සහ අපගේ සේවාවන් පිළිබඳව ඔබ සමඟ සන්නිවේදනය කිරීමට.</li>
                <li>නීතිමය සහ නියාමන අවශ්‍යතාවලට අනුකූල වීමට.</li>
              </ul>

              {/* Data Security */}
              <h2 className="text-2xl font-semibold mb-4">දත්ත ආරක්ෂාව</h2>
              <p className="mb-2">
                ඔබේ දත්තවල ආරක්ෂාව අපි බැරෑරුම් ලෙස සලකනවා. ඔබේ දත්තවලට අනවසර ප්‍රවේශය, වෙනස් කිරීම හෝ හෙළිදරව් කිරීම වැළැක්වීම සඳහා අපි විවිධ ආරක්ෂක පියවරයන් ක්‍රියාත්මක කර තිබෙනවා. මේවාට ඇතුළත් වන්නේ:
              </p>
              <ul className="list-disc list-inside ml-4 mb-4">
                <li>ප්‍රවාහනයේදී සහ විවේකයේදී දත්ත සංකේතනය.</li>
                <li>නිත්‍ය ආරක්ෂක විගණනය සහ අවදානම් පරීක්ෂාවන්.</li>
                <li>අවසර ලත් පුද්ගලයින්ට පමණක් ඔබේ දත්ත වෙත ප්‍රවේ�ශ වීමට හැකි වන පරිදි ප්‍රවේශ පාලනය.</li>
                <li>ගෙවීම් කාඩ් තොරතුරු හැසිරවීම සඳහා PCI DSS වැනි කර්මාන්ත ප්‍රමිතීන්ට අනුකූල වීම.</li>
              </ul>
              <p className="mb-6">
                එක් එක් ව්‍යාපාරයේ දත්ත වෙනම, වෙන් කළ දත්ත සමුදායක හෝ බෙදීමක ගබඩා කර ඇති අතර, එමඟින් විවිධ ගනුදෙනුකරුවන් අතර දත්ත මිශ්‍ර වීම හෝ අනවසර ප්‍රවේශය වැළැක්වේ.
              </p>

              {/* Data Sharing */}
              <h2 className="text-2xl font-semibold mb-4">දත්ත හවුල් කිරීම</h2>
              <p className="mb-2">
                ඔබේ පැහැදිලි කැමැත්තකින් තොරව අපි ඔබේ දත්ත වෙනත් පාර්ශවයන්ට හෙළිදරව් නොකරනවා, පහත තත්වයන් හැර:
              </p>
              <ol className="list-decimal list-inside ml-4 mb-4">
                <li>ඔබට අපගේ සේවාවන් සැපයීම සඳහා, උදාහරණයක් ලෙස ගෙවීම් ගේට්වේ හරහා ගෙවීම් සැකසීමට හෝ වෙනත් ව්‍යාපාරික මෙවලම් සමඟ ඒකාබද්ධ කිරීමට.</li>
                <li>නීතිමය බැඳීම්වලට අනුකූල වීමට හෝ වලංගු නීතිමය ඉල්ලීම්වලට ප්‍රතිචාර දැක්වීමට.</li>
                <li>අපගේ අයිතිවාසිකම්, දේපළ, හෝ ආරක්ෂාව, හෝ අපගේ භාවිතකරුවන්ගේ හෝ මහජනතාවගේ ආරක්ෂාව ආරක්ෂා කිරීමට.</li>
              </ol>
              <p className="mb-6">
                අපගේ සේවාවන් සැපයීම සඳහා ඔබේ පාරිභෝගික දත්ත තෙවන පාර්ශවයන් සමඟ හවුල් කරන විට, එම තෙවන පාර්ශවයන් ඔබේ උපදෙස්වලට සහ අදාළ දත්ත ආරක්ෂණ නීතිවලට අනුකූලව දත්ත හසුරුවන බව අපි සහතික කරනවා. ඔබේ පැහැදිලි කැමැත්තකින් තොරව අපි ඔබේ දත්ත අලෙවිකරණ අරමුණු සඳහා තෙවන පාර්ශවයන්ට විකුණන්නේ නැත, කුලියට දෙන්නේ නැත, හෝ හවුල් කරන්නේ නැත.
              </p>

              {/* Your Rights */}
              <h2 className="text-2xl font-semibold mb-4">ඔබේ අයිතිවාසිකම්</h2>
              <p className="mb-6">
                ව්‍යාපාරික භාවිතකරුවෙකු ලෙස, අප සතුව ඇති ඔබේ දත්ත වෙත ප්‍රවේශ වීමට, නිවැරදි කිරීමට හෝ මකා දැමීමට ඔබට අයිතිය තිබෙනවා. මෙයට ඔබේ ව්‍යාපාරික තොරතුරු සහ ඔබ අපට ලබා දී ඇති ඔබේ පාරිභෝගික දත්ත ඇතුළත් වෙනවා. මෙම අයිතිවාසිකම් ක්‍රියාත්මක කිරීමට, කරුණාකර පහත ලබා දී ඇති තොරතුරු භාවිතා කර අප හා සම්බන්ධ වන්න. එසේම, ඔබේ පාරිභෝගිකයින් ඔවුන්ගේ දත්ත වෙත ප්‍රවේශය, නිවැරදි කිරීම හෝ මකාදැමීම ඉල්ලා සිටින්නේ නම්, අදාළ නීතිවලට අනුකූලව එම ඉල්ලීම් හැසිරවීමට ඔබ වගකිව යුතුයි. එවැනි ඉල්ලීම් කළමනාකරණය කිරීමට අවශ්‍ය මෙවලම් සහ සහාය අපගේ පද්ධතිය හරහා අපි ඔබට සපයනවා.
              </p>

              {/* Data Retention */}
              <h2 className="text-2xl font-semibold mb-4">දත්ත රඳවා ගැනීම</h2>
              <p className="mb-6">
                ඔබට අපගේ සේවාවන් සැපයීමට අවශ්‍ය තාක් කල් හෝ නීතියෙන් අවශ්‍ය තාක් කල් අපි ඔබේ දත්ත රඳවා තබා ගන්නවා. ඔබේ ගිණුම වසා දමා සියලුම ගිවිසුම්ගත බැඳීම් ඉටු වූ පසු, අපගේ දත්ත රඳවා ගැනීමේ ප්‍රතිපත්තිවලට අනුකූලව ඔබේ දත්ත මකා දමනවා.
              </p>

              {/* Cookies and Tracking Technologies */}
              <h2 className="text-2xl font-semibold mb-4">කුකීස් සහ ලුහුබැඳීමේ තාක්ෂණයන්</h2>
              <p className="mb-6">
                සැසි කළමනාකරණය, සත්‍යාපනය, සහ විශ්ලේෂණයන් වැනි අරමුණු සඳහා අපගේ පද්ධතිය කුකීස් හෝ වෙනත් ලුහුබැඳීමේ තාක්ෂණයන් භාවිතා කළ හැකියි, එමඟින් අපගේ සේවාවන් වැඩිදියුණු කරනවා. ඔබ අපට එවැනි තොරතුරු ලබා දී නොමැති නම්, මෙම තාක්ෂණයන් හරහා පුද්ගලිකව හඳුනාගත හැකි තොරතුරු එකතු නොකරනවා. ඔබට ඔබේ බ්‍රව්සර සැකසුම් හරහා කුකී අභිරුචි කළමනාකරණය කළ හැකියි.
              </p>

              {/* International Data Transfers */}
              <h2 className="text-2xl font-semibold mb-4">ජාත්‍යන්තර දත්ත හුවමාරු</h2>
              <p className="mb-6">
                ඔබේ දත්ත [රට/කලාපය] තුළ හෝ අපගේ මෙහෙයුම් ඇති හෝ තෙවන පාර්ශව සේවා සපයන්නන් භාවිතා කරන වෙනත් රටක ගබඩා කර සැකසිය හැකියි. මෙම රහස්‍යතා ප්‍රතිපත්තියට සහ අදාළ නීතිවලට අනුකූලව ඔබේ දත්ත ආරක්ෂා වන බවට සහතික කිරීමට අපි සුදුසු පියවර ගන්නවා. ඔබ විශේෂිත දත්ත ආරක්ෂණ රෙගුලාසි සහිත කලාපයක සිටින්නේ නම් (උදා: යුරෝපීය ආර්ථික කලාපය), එම කලාපයෙන් පිටතට ඔබේ දත්ත හුවමාරු කිරීම එම රෙගුලාසිවලට අනුකූලව සිදු කරන බව අපි සහතික කරනවා.
              </p>

              {/* Data Breach Notification */}
              <h2 className="text-2xl font-semibold mb-4">දත්ත කඩකිරීමේ දැනුම්දීම</h2>
              <p className="mb-6">
                ඔබේ දත්තවල ආරක්ෂක කඩකිරීමක් හෝ අනවසර ප්‍රවේශයක් සිදු වුවහොත්, ඒ ගැන ඔබට හැකි ඉක්මනින් දැනුම් දී, ගැටලුව විමර්ශනය කිරීමට සහ පිළිසකර කිරීමට සුදුසු පියවර ගන්නවා. බලපෑමට ලක් වූ පුද්ගලයින්ට හෝ නියාමන බලධාරීන්ට දැනුම් දීම සඳහා ඕනෑම නීතිමය අවශ්‍යතාවලට ද අපි අනුකූල වෙනවා.
              </p>

              {/* Complaints and Concerns */}
              <h2 className="text-2xl font-semibold mb-4">පැමිණිලි සහ සැලකිලි</h2>
              <p className="mb-6">
                අපගේ දත්ත හැසිරවීමේ පිළිවෙත් ගැන ඔබට පැමිණිලි හෝ සැලකිලි තිබේ නම්, කරුණාකර පහත ලබා දී ඇති තොරතුරු භාවිතා කර අප හා සම්බන්ධ වන්න. ඔබේ සැලකිලි කඩිනමින් විමර්ශනය කර විසඳීමට අපි කටයුතු කරනවා.
              </p>

              {/* Contact Us */}
              <h2 className="text-2xl font-semibold mb-4">අප හා සම්බන්ධ වන්න</h2>
              <p className="mb-2">
                මෙම රහස්‍යතා ප්‍රතිපත්තිය හෝ අපගේ දත්ත පිළිබඳ ප්‍රශ්න හෝ සැලකිලි තිබේ නම්, කරුණාකර අපගේ රහස්‍යතා නිලධාරියාට පහත තොරතුරු භාවිතා කර සම්බන්ධ වන්න:
              </p>
              <ul className="list-none ml-4 mb-6">
                <li>ඊමේල්: legendbyteworld@gmail.com</li>
                {/* <li>දුරකථන: xxxxxxx</li> */}
                {/* <li>තැපැල් ලිපිනය: [ලිපිනය]</li> */}
              </ul>

              {/* Policy Updates */}
              <h2 className="text-2xl font-semibold mb-4">ප්‍රතිපත්ති යාවත්කාලීන කිරීම්</h2>
              <p className="mb-6">
                අපගේ දත්ත පිළිවෙත්වල හෝ නීතිමය අවශ්‍යතාවල වෙනස්කම් පිළිබිඹු කිරීමට අපි මෙම රහස්‍යතා ප්‍රතිපත්තිය වරින් වර යාවත්කාලීන කළ හැකියි. යම් සැලකිය යුතු වෙනස්කම් ඇති වුවහොත්, ඒ ගැන ඔබට අපගේ වෙබ් අඩවියේ යාවත්කාලීන ප්‍රතිපත්තිය පළ කිරීමෙන් හෝ වෙනත් සන්නිවේදන මාධ්‍ය හරහා දැනුම් දෙනවා.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Last Updated: March 11, 2025
              {/* Sinhala: අවසන් වරට යාවත්කාලීන කළේ: 2025 මාර්තු 11 */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;