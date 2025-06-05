'use client';

export default function PrivacyPage() {
  const effectiveDate = 'July 1, 2025';
  const companyName = '론드코퍼레이션(Rond Corporation)'; // 회사명
  const companyAddress = '서울특별시 강남구 테헤란로70길 12, H타워'; // 회사 주소
  const companyContactEmail = 'info@rondcorp.com'; // 회사 이메일
  const companyContactPhone = '02-1234-5678'; // 회사 전화번호
  const dpoName = '김동연'; // 개인정보 보호 책임자(DPO) 이름
  const dpoDepartment = '론드코퍼레이션'; // 개인정보 보호 책임자(DPO) 소속 부서 명
  const dpoPosition = '대표'; // 개인 정보 보호 책임자(DPO) 직위
  const dpoEmail = 'info@rondcorp.com'; // 개인정보 보호 책임자(DPO) 이메일
  const dpoPhone = '+82 10 5231 1263'; // 개인정보 보호 책임자(DPO) 전화번호
  const cloudProviderName = 'Amazon Web Services, Vercel'; // 클라우드 서비스 제공업체명

  const hasEntrustment = false; // 개인정보 처리 위탁 여부
  const trusteeName1 = '[Trustee Name 1]';
  const entrustedTask1 =
    '[Entrusted Task e.g., Cloud hosting and data storage]';
  const trusteeName2 = '[Trustee Name 2]';
  const entrustedTask2 =
    '[Entrusted Task e.g., Customer support system operation]';

  const englishPrivacyPolicy = (
    <div className="prose prose-sm md:prose-base dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        <strong>Effective Date: {effectiveDate}</strong>
      </p>
      <p>
        Welcome to LikeButter (hereinafter referred to as the "Service"),
        operated by {companyName} (hereinafter referred to as the "Company").
        The Company takes your privacy very seriously and is committed to
        protecting your personal information in compliance with the Personal
        Information Protection Act of the Republic of Korea and other applicable
        laws and regulations. This Privacy Policy outlines how we collect, use,
        disclose, and protect your personal information.
      </p>
      <h2>1. Personal Information We Collect</h2>
      <p>
        The Company collects the following personal information for membership
        registration, service provision, and customer support:
      </p>
      <ul>
        <li>
          <strong>Information you provide directly:</strong>
          <ul>
            <li>
              Required: Email address, password, name, gender, nationality.
            </li>
            <li>Optional: Phone number.</li>
            <li>
              When using specific services (e.g., AI Cover, AI Fan Art, AI
              Video, Virtual Talk): Content you upload or create, such as
              images, text prompts, voice data, video data. This data is
              processed to provide the requested service features.
            </li>
          </ul>
        </li>
        <li>
          <strong>Information collected automatically:</strong>
          <ul>
            <li>
              Service usage records, access logs, cookies, IP address, device
              information (OS type, browser type), advertising identifiers.
            </li>
          </ul>
        </li>
      </ul>
      <p>
        <strong>Method of Collection:</strong>
      </p>
      <ul>
        <li>
          Through the Service's website during membership registration or
          service use.
        </li>
        <li>
          Through tools that collect generated information during service use
          (e.g., cookies).
        </li>
        <li>Through customer service inquiries (web form, email, phone).</li>
      </ul>
      <h2>2. Purpose of Collection and Use of Personal Information</h2>
      <p>
        The Company uses the collected personal information for the following
        purposes:
      </p>
      <ul>
        <li>
          Providing and operating the Services, including member identification
          and authentication.
        </li>
        <li>
          Managing memberships, including handling inquiries and complaints, and
          sending notices.
        </li>
        <li>
          Developing new services and improving existing services based on usage
          analysis.
        </li>
        <li>
          Providing personalized content and advertisements (with consent where
          required).
        </li>
        <li>
          Statistical analysis for service improvement and marketing (data is
          anonymized or pseudonymized for statistical purposes).
        </li>
        <li>Complying with legal obligations and resolving disputes.</li>
        <li>Preventing unauthorized or fraudulent use of the Services.</li>
      </ul>
      <h2>3. Provision of Personal Information to Third Parties</h2>
      <p>
        The Company, in principle, does not provide users' personal information
        to third parties without the prior consent of the user. However,
        exceptions are made in the following cases:
      </p>
      <ul>
        <li>When the user has given prior consent.</li>
        <li>
          When required by law, or for the purpose of investigation by an
          investigative agency according to the procedures and methods
          prescribed by law.
        </li>
        <li>
          When necessary for statistical purposes, academic research, or market
          research, provided that the information is processed in a form that
          does not identify specific individuals.
        </li>
        <li>
          [List any other specific third-party provisions, e.g., payment
          processors, if applicable, along with purpose and information shared.]
        </li>
      </ul>
      <h2>4. Entrustment of Personal Information Processing</h2>
      <p>
        The Company may entrust the processing of personal information to
        external specialized companies for the smooth operation of the service.
        In such cases, the Company shall specify matters necessary for the safe
        management of personal information in documents such as contracts, and
        supervise the trustee.
      </p>
      {hasEntrustment ? (
        <>
          <p>Current entrusted parties and tasks:</p>
          <ul>
            <li>
              {trusteeName1}: {entrustedTask1}
            </li>
            <li>
              {trusteeName2}: {entrustedTask2}
            </li>
            {/* Add more trustees if necessary */}
          </ul>
        </>
      ) : (
        <p>
          The Company does not currently entrust the processing of your personal
          information to third parties.
        </p>
      )}
      <h2>5. Period of Retention and Use of Personal Information</h2>
      <p>
        In principle, the Company destroys the user's personal information
        without delay when the purpose of collecting or using the personal
        information is achieved or the retention period expires. However, if
        personal information needs to be retained pursuant to the provisions of
        relevant laws and regulations, it will be retained for the period
        stipulated by such laws and regulations as follows:
      </p>
      <ul>
        <li>
          Records on contracts or subscription withdrawal: 5 years (Act on
          Consumer Protection in Electronic Commerce, etc.)
        </li>
        <li>
          Records on payment and supply of goods: 5 years (Act on Consumer
          Protection in Electronic Commerce, etc.)
        </li>
        <li>
          Records on consumer complaints or dispute resolution: 3 years (Act on
          Consumer Protection in Electronic Commerce, etc.)
        </li>
        <li>
          Records on website visits (access logs): 3 months (Protection of
          Communications Secrets Act)
        </li>
        <li>
          Other information: Until membership withdrawal or termination of the
          service agreement. Information related to service usage (e.g.,
          AI-generated content) may be retained for service improvement purposes
          after pseudonymization or anonymization if the user withdraws.
        </li>
      </ul>
      <h2>6. Procedure and Method of Destroying Personal Information</h2>
      <p>
        The Company, in principle, destroys personal information without delay
        after the retention period has expired or the purpose of processing has
        been achieved. The procedure and method of destruction are as follows:
      </p>
      <ul>
        <li>
          <strong>Destruction Procedure:</strong> Information entered by the
          user is transferred to a separate DB (or separate filing cabinet for
          paper) after the purpose is achieved and stored for a certain period
          according to internal policies and other relevant laws and regulations
          (refer to retention and use period) before being destroyed. Personal
          information transferred to a separate DB is not used for any other
          purpose unless required by law.
        </li>
        <li>
          <strong>Destruction Method:</strong>
          <ul>
            <li>
              Personal information stored in electronic file format is deleted
              using a technical method that makes the records irrecoverable.
            </li>
            <li>
              Personal information printed on paper is shredded or incinerated.
            </li>
          </ul>
        </li>
      </ul>
      <h2>
        7. Rights of Users and Legal Representatives and How to Exercise Them
      </h2>
      <p>
        Users (or their legal representatives if the user is under 14 years of
        age) may exercise the following rights regarding their personal
        information at any time:
      </p>
      <ul>
        <li>Request access to their personal information.</li>
        <li>Request correction of errors in their personal information.</li>
        <li>Request deletion of their personal information.</li>
        <li>
          Request suspension of the processing of their personal information.
        </li>
      </ul>
      <p>
        These rights can be exercised by contacting the Company's Personal
        Information Protection Officer in writing, by phone, or by email, and
        the Company will take necessary measures without delay. If a user
        requests correction of errors in their personal information, the Company
        will not use or provide the personal information until the correction is
        completed. The Company processes personal information that has been
        terminated or deleted at the request of the user or legal representative
        as specified in "5. Period of Retention and Use of Personal Information"
        and ensures it is not viewed or used for any other purpose. Users can
        manage or withdraw their consent for collection/use of personal
        information through the account settings page or by contacting customer
        service.
      </p>
      <h2>
        8. Matters Concerning Installation, Operation, and Refusal of Automatic
        Personal Information Collection Devices (e.g., Cookies)
      </h2>
      <p>
        The Company uses 'cookies' to store and frequently retrieve user
        information to provide personalized services. Cookies are small text
        files sent by the server operating the website to the user's browser and
        stored on the user's computer hard disk.
      </p>
      <ul>
        <li>
          <strong>Purpose of using cookies:</strong> To provide optimized
          information to users by identifying an individual's visit and usage
          patterns for each service and website, popular search terms, secure
          access status, etc.
        </li>
        <li>
          <strong>Installation, operation, and refusal of cookies:</strong>{' '}
          Users have the option to install cookies. Therefore, users can allow
          all cookies by setting options in their web browser, go through a
          confirmation process each time a cookie is saved, or refuse to save
          all cookies.
          <ul>
            <li>
              Example of setting (for Internet Explorer): Tools menu at the top
              of the web browser &gt; Internet Options &gt; Personal Information
              tab &gt; Cookie settings.
            </li>
            <li>
              However, if you refuse to install cookies, there may be
              difficulties in using some services that require login.
            </li>
          </ul>
        </li>
      </ul>
      <h2>
        9. Technical and Managerial Safeguards for Personal Information
        Protection
      </h2>
      <p>
        The Company takes the following technical and managerial measures to
        ensure the safety of personal information so that it is not lost,
        stolen, leaked, altered, or damaged in handling users' personal
        information:
      </p>
      <ul>
        <li>
          <strong>Encryption of Personal Information:</strong> User passwords
          are encrypted for storage and management, and important data is
          encrypted or uses file locking functions for separate security.
        </li>
        <li>
          <strong>Measures against Hacking, etc.:</strong> The Company does an
          effort to prevent leakage or damage of users' personal information by
          hacking or computer viruses. Data is backed up periodically in
          preparation for damage to personal information, and the latest
          antivirus programs are used to prevent leakage or damage of users'
          personal information or data. Secure transmission of personal
          information on the network is ensured through encrypted communication.
        </li>
        <li>
          <strong>
            Minimizing and Educating Staff Handling Personal Information:
          </strong>{' '}
          The Company limits the staff handling personal information to those in
          charge and grants separate passwords for this purpose, which are
          renewed regularly. Compliance with this Privacy Policy and internal
          guidelines is emphasized through regular training for staff.
        </li>
        <li>
          <strong>
            Establishment and Operation of an Internal Management Plan:
          </strong>{' '}
          An internal management plan is established and implemented for the
          safe processing of personal information.
        </li>
        <li>
          <strong>Access Control:</strong> An intrusion prevention system is
          used to control unauthorized access from outside, and we strive to
          equip all possible technical devices to ensure system security.
        </li>
      </ul>
      <h2>10. Personal Information Protection Officer (DPO)</h2>
      <p>
        The Company designates a Personal Information Protection Officer to be
        responsible for overall matters concerning the processing of personal
        information and to handle complaints and damage relief from data
        subjects related to personal information processing. Users can contact
        the Personal Information Protection Officer for any inquiries,
        complaints, or damage relief related to personal information protection
        arising from the use of the Company's services.
      </p>
      <ul>
        <li>
          <strong>Name:</strong> {dpoName}
        </li>
        <li>
          <strong>Department:</strong> {dpoDepartment}
        </li>
        <li>
          <strong>Position:</strong> {dpoPosition}
        </li>
        <li>
          <strong>Email:</strong> {dpoEmail}
        </li>
        <li>
          <strong>Phone:</strong> {dpoPhone}
        </li>
      </ul>
      <h2>11. International Transfer of Personal Information</h2>
      <p>
        The Company, in principle, processes users' personal information within
        the Republic of Korea. If it becomes necessary to transfer personal
        information overseas for service provision, the Company will notify the
        user in advance of the items of personal information to be transferred,
        the country to which it will be transferred, the date and method of
        transfer, the name of the entity receiving the personal information, and
        the purpose of use and retention period of the personal information by
        the receiving entity, and obtain separate consent.
      </p>
      <p>
        Currently, data may be stored on cloud servers provided by{' '}
        {cloudProviderName} which may have data centers located globally. We
        ensure that such providers adhere to strict data protection standards.
      </p>
      <h2>12. Changes to the Privacy Policy</h2>
      <p>
        This Privacy Policy may be amended due to changes in laws, policies, or
        security technologies. Any additions, deletions, or modifications to the
        content will be announced through a notice on the website at least 7
        days prior to the enforcement of the revised policy. However, if there
        are significant changes to user rights, such as changes in the items of
        personal information collected or the purpose of use, we will notify
        users at least 30 days in advance and may seek consent again if
        necessary.
      </p>
      <h2>13. Duty of Notification Prior to Policy Changes</h2>
      <p>
        This Privacy Policy was last updated on {effectiveDate}, and if there
        are any additions, deletions, or amendments in accordance with changes
        in government policies or security technologies, they will be announced
        through the "Notice" section of the website at least 7 days prior to the
        implementation of the changes.
      </p>
      <h2>14. Contact Information</h2>
      <p>
        If you have any questions or concerns regarding this Privacy Policy or
        our handling of your personal information, please contact us at:
      </p>
      <ul>
        <li>
          <strong>Company Name:</strong> {companyName}
        </li>
        <li>
          <strong>Address:</strong> {companyAddress}
        </li>
        <li>
          <strong>Email:</strong> {companyContactEmail}
        </li>
        <li>
          <strong>Phone:</strong> {companyContactPhone}
        </li>
      </ul>
      <p>
        Users may also report any personal information infringement incidents to
        the Personal Information Infringement Report Center operated by the
        Korea Internet & Security Agency (KISA) or other relevant agencies.
      </p>
      <ul>
        <li>
          Personal Information Infringement Report Center (privacy.kisa.or.kr /
          Call 118 without area code)
        </li>
        <li>
          Cybercrime Investigation Division, Supreme Prosecutors' Office
          (www.spo.go.kr / Call 1301 without area code)
        </li>
        <li>
          National Police Agency Cyber Bureau (ecrm.cyber.go.kr / Call 182
          without area code)
        </li>
      </ul>
    </div>
  );

  const koreanPrivacyPolicy = (
    <div className="prose prose-sm md:prose-base dark:prose-invert">
      <h1>개인정보처리방침</h1>
      <p>
        <strong>시행일자: {effectiveDate}</strong>
      </p>
      <p>
        {companyName} (이하 "회사")가 운영하는 LikeButter 서비스(이하
        "서비스")에 오신 것을 환영합니다. 회사는 정보통신망 이용촉진 및 정보보호
        등에 관한 법률, 개인정보 보호법 등 대한민국 관련 법규를 준수하며,
        이용자의 개인정보를 소중하게 생각하고 보호하기 위해 최선을 다하고
        있습니다. 본 개인정보처리방침은 회사가 이용자의 개인정보를 어떻게 수집,
        이용, 제공하며 보호하는지에 대한 내용을 담고 있습니다.
      </p>
      <h2>제1조 (수집하는 개인정보의 항목 및 수집방법)</h2>
      <p>
        회사는 회원가입, 서비스 제공, 고객상담 등을 위해 아래와 같은 개인정보를
        수집하고 있습니다.
      </p>
      <ul>
        <li>
          <strong>이용자가 직접 제공하는 정보:</strong>
          <ul>
            <li>필수항목: 이메일 주소, 비밀번호, 이름, 성별, 국적</li>
            <li>선택항목: 전화번호</li>
            <li>
              특정 서비스 이용 시 (예: AI 커버, AI 팬아트, AI 비디오, 가상통화):
              이용자가 업로드하거나 생성하는 콘텐츠 (이미지, 텍스트 프롬프트,
              음성 데이터, 영상 데이터 등). 해당 데이터는 요청된 서비스 기능을
              제공하기 위해 처리됩니다.
            </li>
          </ul>
        </li>
        <li>
          <strong>자동으로 수집되는 정보:</strong>
          <ul>
            <li>
              서비스 이용 기록, 접속 로그, 쿠키, IP 주소, 기기 정보 (OS 종류,
              브라우저 종류), 광고 식별자 등
            </li>
          </ul>
        </li>
      </ul>
      <p>
        <strong>수집방법:</strong>
      </p>
      <ul>
        <li>서비스 웹사이트에서의 회원가입 또는 서비스 이용 과정</li>
        <li>서비스 이용 과정에서 생성정보 수집 툴(쿠키 등)을 통한 수집</li>
        <li>고객센터 문의(웹폼, 이메일, 전화)</li>
      </ul>
      <h2>제2조 (개인정보의 수집 및 이용목적)</h2>
      <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
      <ul>
        <li>서비스 제공 및 운영 (회원 식별 및 인증 포함)</li>
        <li>회원 관리 (문의 및 불만 처리, 공지사항 전달 등)</li>
        <li>이용 분석을 통한 신규 서비스 개발 및 기존 서비스 개선</li>
        <li>맞춤형 콘텐츠 및 광고 제공 (필요시 동의 획득)</li>
        <li>
          서비스 개선 및 마케팅을 위한 통계 분석 (통계 목적 시 익명화 또는
          가명화 처리)
        </li>
        <li>법적 의무 준수 및 분쟁 해결</li>
        <li>서비스의 무단 또는 부정 이용 방지</li>
      </ul>
      <h2>제3조 (개인정보의 제3자 제공)</h2>
      <p>
        회사는 원칙적으로 이용자의 사전 동의 없이 개인정보를 외부에 제공하지
        않습니다. 다만, 다음의 경우에는 예외로 합니다.
      </p>
      <ul>
        <li>이용자가 사전에 동의한 경우</li>
        <li>
          법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에
          따라 수사기관의 요구가 있는 경우
        </li>
        <li>
          통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을
          알아볼 수 없는 형태로 가공하여 제공하는 경우
        </li>
        <li>
          [기타 제3자 제공 사항 명시 (예: 결제 처리 업체 등, 목적 및 공유 정보
          포함)]
        </li>
      </ul>
      <h2>제4조 (개인정보처리의 위탁)</h2>
      <p>
        회사는 원활한 서비스 운영을 위해 개인정보 처리업무를 외부 전문업체에
        위탁할 수 있습니다. 이 경우 회사는 계약서 등을 통하여 개인정보의 안전한
        관리를 위해 필요한 사항을 규정하고 수탁자를 감독합니다.
      </p>
      {hasEntrustment ? (
        <>
          <p>현재 위탁 업체 및 업무 내용:</p>
          <ul>
            <li>
              {trusteeName1}: {entrustedTask1}
            </li>
            <li>
              {trusteeName2}: {entrustedTask2}
            </li>
            {/* 필요시 위탁 업체 추가 */}
          </ul>
        </>
      ) : (
        <p>
          회사는 현재 이용자의 개인정보 처리업무를 외부에 위탁하고 있지
          않습니다.
        </p>
      )}
      <h2>제5조 (개인정보의 보유 및 이용기간)</h2>
      <p>
        회사는 원칙적으로 개인정보 수집 및 이용목적이 달성되거나 보유기간이
        만료된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에
        의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서 정한
        일정한 기간 동안 회원정보를 보관합니다.
      </p>
      <ul>
        <li>
          계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의
          소비자보호에 관한 법률)
        </li>
        <li>
          대금결제 및 재화 등의 공급에 관한 기록: 5년 (전자상거래 등에서의
          소비자보호에 관한 법률)
        </li>
        <li>
          소비자의 불만 또는 분쟁처리에 관한 기록: 3년 (전자상거래 등에서의
          소비자보호에 관한 법률)
        </li>
        <li>웹사이트 방문기록(접속 로그): 3개월 (통신비밀보호법)</li>
        <li>
          기타 정보: 회원 탈퇴 시 또는 서비스 계약 종료 시까지. 단, 서비스 이용
          관련 정보(AI 생성 콘텐츠 등)는 이용자 탈퇴 후 서비스 개선 목적으로
          가명처리 또는 익명처리 후 보유할 수 있습니다.
        </li>
      </ul>
      <h2>제6조 (개인정보의 파기절차 및 방법)</h2>
      <p>
        회사는 원칙적으로 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가
        불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다. 파기절차
        및 방법은 다음과 같습니다.
      </p>
      <ul>
        <li>
          <strong>파기절차:</strong> 이용자가 입력한 정보는 목적 달성 후 별도의
          DB(종이의 경우 별도의 서류함)로 옮겨져 내부 방침 및 기타 관련 법령에
          의한 정보보호 사유에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후
          파기됩니다. 별도 DB로 옮겨진 개인정보는 법률에 의한 경우가 아니고서는
          다른 목적으로 이용되지 않습니다.
        </li>
        <li>
          <strong>파기방법:</strong>
          <ul>
            <li>
              전자적 파일 형태로 저장된 개인정보는 기록을 재생할 수 없는 기술적
              방법을 사용하여 삭제합니다.
            </li>
            <li>
              종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여
              파기합니다.
            </li>
          </ul>
        </li>
      </ul>
      <h2>제7조 (이용자 및 법정대리인의 권리와 그 행사방법)</h2>
      <p>
        이용자(만 14세 미만 아동의 경우 법정대리인)는 언제든지 등록되어 있는
        자신 혹은 당해 만 14세 미만 아동의 개인정보에 대해 다음의 권리를 행사할
        수 있습니다.
      </p>
      <ul>
        <li>개인정보 열람 요구</li>
        <li>오류 등이 있을 경우 정정 요구</li>
        <li>삭제 요구</li>
        <li>처리정지 요구</li>
      </ul>
      <p>
        이러한 권리 행사는 회사에 대해 서면, 전화 또는 이메일로 연락하시면 지체
        없이 조치하겠습니다. 이용자가 개인정보의 오류 등에 대한 정정을 요청하신
        경우에는 정정을 완료하기 전까지 당해 개인정보를 이용 또는 제공하지
        않습니다. 회사는 이용자 혹은 법정 대리인의 요청에 의해 해지 또는 삭제된
        개인정보는 "제5조 (개인정보의 보유 및 이용기간)"에 명시된 바에 따라
        처리하고 그 외의 용도로 열람 또는 이용할 수 없도록 처리하고 있습니다.
        이용자는 계정 설정 페이지를 통하거나 고객센터 문의를 통해 개인정보
        수집/이용 동의를 철회할 수 있습니다.
      </p>
      <h2>제8조 (개인정보 자동 수집 장치의 설치∙운영 및 거부에 관한 사항)</h2>
      <p>
        회사는 이용자에게 특화된 맞춤서비스를 제공하기 위해서 이용자들의 정보를
        저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다. 쿠키는 웹사이트를
        운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는
        소량의 정보이며 이용자들의 PC 컴퓨터 내의 하드디스크에 저장되기도
        합니다.
      </p>
      <ul>
        <li>
          <strong>쿠키의 사용 목적:</strong> 이용자들이 방문한 각 서비스와 웹
          사이트들에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을
          파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
        </li>
        <li>
          <strong>쿠키의 설치∙운영 및 거부:</strong> 이용자는 쿠키 설치에 대한
          선택권을 가지고 있습니다. 따라서, 이용자는 웹브라우저에서 옵션을
          설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을
          거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
          <ul>
            <li>
              설정방법 예(인터넷 익스플로러의 경우): 웹 브라우저 상단의 도구
              &gt; 인터넷 옵션 &gt; 개인정보 탭 &gt; 쿠키 설정
            </li>
            <li>
              다만, 쿠키의 저장을 거부할 경우에는 로그인이 필요한 일부 서비스는
              이용에 어려움이 있을 수 있습니다.
            </li>
          </ul>
        </li>
      </ul>
      <h2>제9조 (개인정보의 안전성 확보 조치)</h2>
      <p>
        회사는 이용자들의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 유출,
        변조 또는 훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적
        대책을 강구하고 있습니다.
      </p>
      <ul>
        <li>
          <strong>개인정보 암호화:</strong> 이용자의 비밀번호는 암호화되어 저장
          및 관리되고 있으며, 중요한 데이터는 파일 및 전송 데이터를 암호화하거나
          파일 잠금 기능을 사용하는 등의 별도 보안기능을 통해 보호되고 있습니다.
        </li>
        <li>
          <strong>해킹 등에 대비한 대책:</strong> 회사는 해킹이나 컴퓨터
          바이러스 등에 의해 회원의 개인정보가 유출되거나 훼손되는 것을 막기
          위해 최선을 다하고 있습니다. 개인정보의 훼손에 대비해서 자료를 수시로
          백업하고 있고, 최신 백신프로그램을 이용하여 이용자들의 개인정보나
          자료가 유출되거나 손상되지 않도록 방지하고 있으며, 암호화통신 등을
          통하여 네트워크상에서 개인정보를 안전하게 전송할 수 있도록 하고
          있습니다.
        </li>
        <li>
          <strong>개인정보 처리 직원의 최소화 및 교육:</strong> 회사의 개인정보
          관련 처리 직원은 담당자에 한정시키고 있고 이를 위한 별도의 비밀번호를
          부여하여 정기적으로 갱신하고 있으며, 담당자에 대한 수시 교육을 통하여
          본 개인정보처리방침 및 내부 지침 준수를 항상 강조하고 있습니다.
        </li>
        <li>
          <strong>내부관리계획의 수립 및 시행:</strong> 개인정보의 안전한 처리를
          위하여 내부관리계획을 수립하고 시행하고 있습니다.
        </li>
        <li>
          <strong>접근통제:</strong> 침입차단시스템을 이용하여 외부로부터의 무단
          접근을 통제하고 있으며, 기타 시스템적으로 보안성을 확보하기 위한
          가능한 모든 기술적 장치를 갖추려 노력하고 있습니다.
        </li>
      </ul>
      <h2>제10조 (개인정보 보호책임자)</h2>
      <p>
        회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와
        관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보
        보호책임자를 지정하고 있습니다. 이용자는 회사의 서비스를 이용하시면서
        발생하는 모든 개인정보보호 관련 문의, 불만처리, 피해구제 등에 관한
        사항을 개인정보 보호책임자에게 문의하실 수 있습니다.
      </p>
      <ul>
        <li>
          <strong>이름:</strong> {dpoName}
        </li>
        <li>
          <strong>소속:</strong> {dpoDepartment}
        </li>
        <li>
          <strong>직위:</strong> {dpoPosition}
        </li>
        <li>
          <strong>이메일:</strong> {dpoEmail}
        </li>
        <li>
          <strong>전화번호:</strong> {dpoPhone}
        </li>
      </ul>
      <h2>제11조 (개인정보의 국외 이전)</h2>
      <p>
        회사는 원칙적으로 이용자의 개인정보를 대한민국 내에서 처리합니다. 만약
        서비스 제공을 위해 개인정보의 국외 이전이 필요한 경우, 이전되는 개인정보
        항목, 이전되는 국가, 이전 일시 및 방법, 이전받는 자의 성명, 이전받는
        자의 이용 목적 및 보유·이용 기간 등을 이용자에게 사전에 고지하고 별도의
        동의를 받을 것입니다.
      </p>
      <p>
        현재 데이터는 {cloudProviderName}에서 제공하는 클라우드 서버에 저장될 수
        있으며, 해당 서버는 전 세계에 데이터 센터를 보유하고 있을 수 있습니다.
        회사는 이러한 제공업체가 엄격한 데이터 보호 표준을 준수하도록
        보장합니다.
      </p>
      <h2>제12조 (개인정보처리방침 변경)</h2>
      <p>
        본 개인정보처리방침은 법령, 정책 또는 보안기술의 변경에 따라 내용의
        추가, 삭제 및 수정이 있을 시에는 개정 최소 7일 전부터 홈페이지의
        '공지사항'을 통해 고지할 것입니다. 다만, 수집하는 개인정보의 항목,
        이용목적의 변경 등과 같이 이용자 권리의 중대한 변경이 발생할 때에는 최소
        30일 전에 고지하며, 필요 시 이용자 동의를 다시 받을 수도 있습니다.
      </p>
      <h2>제13조 (변경 전 고지의무)</h2>
      <p>
        본 개인정보처리방침은 {effectiveDate}에 최종 수정되었으며, 정부의 정책
        또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 경우에는
        변경사항의 시행 7일 전부터 웹사이트의 '공지사항'을 통하여 고지할
        것입니다.
      </p>
      <h2>제14조 (문의처)</h2>
      <p>
        본 개인정보처리방침 또는 회사의 개인정보 처리에 관한 질문이나 우려사항이
        있으시면 다음 연락처로 문의해 주시기 바랍니다.
      </p>
      <ul>
        <li>
          <strong>회사명:</strong> {companyName}
        </li>
        <li>
          <strong>주소:</strong> {companyAddress}
        </li>
        <li>
          <strong>이메일:</strong> {companyContactEmail}
        </li>
        <li>
          <strong>전화번호:</strong> {companyContactPhone}
        </li>
      </ul>
      <p>
        기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에
        문의하시기 바랍니다.
      </p>
      <ul>
        <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
        <li>대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)</li>
        <li>경찰청 사이버안전국 (ecrm.cyber.go.kr / 국번없이 182)</li>
      </ul>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen pt-24 md:pt-28">
      <h1 className="text-3xl md:text-4xl font-bold text-accent text-center mb-8 md:mb-12">
        Privacy Policy / 개인정보처리방침
      </h1>
      <div className="flex flex-col md:flex-row gap-0 md:gap-8">
        {/* Left Column: English */}
        <div className="md:w-1/2 p-4 border-b md:border-b-0 md:border-r border-slate-700 mb-8 md:mb-0 overflow-y-auto md:max-h-[calc(100vh-12rem)]">
          {englishPrivacyPolicy}
        </div>

        {/* Right Column: Korean */}
        <div className="md:w-1/2 p-4 overflow-y-auto md:max-h-[calc(100vh-12rem)]">
          {koreanPrivacyPolicy}
        </div>
      </div>
      <style jsx global>{`
        /* Specificity increased for prose elements within the columns */
        .md\\:w-1\\/2 .prose h1 {
          /* Section titles within prose */
          @apply text-xl md:text-2xl font-bold mt-6 mb-3 text-accent;
        }
        .md\\:w-1\\/2 .prose h2 {
          /* Section subtitles within prose */
          @apply text-lg md:text-xl font-semibold mt-5 mb-2 text-slate-200;
        }
        .md\\:w-1\\/2 .prose p,
        .md\\:w-1\\/2 .prose ul,
        .md\\:w-1\\/2 .prose li {
          @apply text-slate-300;
        }
        .md\\:w-1\\/2 .prose p {
          @apply mb-3 leading-relaxed; /* Added leading-relaxed for better paragraph spacing */
        }
        .md\\:w-1\\/2 .prose strong {
          @apply text-slate-100;
        }
        .md\\:w-1\\/2 .prose ul {
          @apply list-disc pl-5 mb-3;
        }
        .md\\:w-1\\/2 .prose li {
          @apply mb-1;
        }
        .md\\:w-1\\/2 .prose ul ul {
          @apply list-circle pl-5 mt-1;
        }
        .md\\:w-1\\/2 .prose a {
          @apply text-accent hover:underline;
        }
      `}</style>
    </div>
  );
}
