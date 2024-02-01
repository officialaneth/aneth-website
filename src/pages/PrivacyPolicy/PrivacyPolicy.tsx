import {
  Flex,
  Heading,
  Text,
  VStack,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react';
import React, { ReactNode } from 'react';

const Paragraph = ({
  heading,
  text,
}: {
  heading: string;
  text: string | ReactNode;
}) => {
  return (
    <Flex maxW={1000} direction="column" gap={5}>
      <Heading fontWeight={500} size="lg">
        {heading}
      </Heading>
      <Text fontSize="lg" fontWeight={500}>
        {text}
      </Text>
    </Flex>
  );
};

export const PrivacyPolicy = () => {
  return (
    <VStack>
      <Flex maxW={1000} direction="column" gap={10} px={5}>
        <Heading color="twitter.500">ANETH - Privacy Policy</Heading>
        <Flex maxW={1000} direction="column" gap={5}>
          <Paragraph
            heading="1. Introduction"
            text="ANETH is committed to protecting the privacy of its users. This Privacy Policy outlines how we collect, use, disclose, and safeguard your personal information when you use our services. By accessing or using ANETH, you consent to the terms outlined in this Privacy Policy."
          ></Paragraph>
          <Paragraph
            heading="2. Information We Collect"
            text={
              <UnorderedList>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    User Account Information:
                  </Text>{' '}
                  When you register an account with ANETH, we collect
                  information such as your name, email address, and other
                  necessary details.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    Transaction Data:
                  </Text>{' '}
                  We may collect information related to your transactions on the
                  ANETH platform, including wallet addresses, transaction
                  amounts, and timestamps.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    Device Information:
                  </Text>{' '}
                  We may collect information about the device you use to access
                  ANETH, such as IP address, browser type, and operating system.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    Cookies:
                  </Text>{' '}
                  ANETH uses cookies to enhance user experience and collect data
                  about usage patterns on our platform.
                </ListItem>
              </UnorderedList>
            }
          ></Paragraph>
          <Paragraph
            heading="3. How We Use Your Information"
            text={
              <UnorderedList>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    To Provide Services:
                  </Text>{' '}
                  We use your information to provide and improve our services,
                  process transactions, and enhance user experience.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    Security and Fraud Prevention:
                  </Text>{' '}
                  We use collected data to monitor and prevent fraudulent
                  activities, ensuring the security of our users and the ANETH
                  platform.
                </ListItem>
                <ListItem>
                  <Text as="span" fontWeight={900}>
                    Communication:
                  </Text>{' '}
                  We may use your contact information to send important updates,
                  announcements, and promotional materials. You can opt-out of
                  promotional communications.
                </ListItem>
                <ListItem>Facilisis in pretium nisl aliquet</ListItem>
              </UnorderedList>
            }
          ></Paragraph>
          <Paragraph
            heading="4. Sharing Your Information"
            text={
              <Flex direction="column">
                <Text>
                  ANETH does not sell, trade, or rent your personal information
                  to third parties. We may share your information in the
                  following instances:
                </Text>
                <UnorderedList>
                  <ListItem>
                    <Text as="span" fontWeight={900}>
                      With Your Consent:
                    </Text>{' '}
                    We may share your information with third parties if you
                    provide explicit consent.
                  </ListItem>
                  <ListItem>
                    <Text as="span" fontWeight={900}>
                      Service Providers:
                    </Text>{' '}
                    We may engage third-party service providers to assist with
                    various aspects of our services.
                  </ListItem>
                  <ListItem>
                    <Text as="span" fontWeight={900}>
                      Legal Compliance:
                    </Text>{' '}
                    We may disclose your information if required by law or in
                    response to legal requests.
                  </ListItem>
                </UnorderedList>
              </Flex>
            }
          ></Paragraph>
          <Paragraph
            heading="5. Data Security"
            text={
              <Text>
                ANETH employs industry-standard security measures to protect
                your information from unauthorized access, disclosure,
                alteration, and destruction.
              </Text>
            }
          ></Paragraph>
          <Paragraph
            heading="6. Your Choices"
            text="You have the right to access, correct, or delete your personal information. You may also opt-out of certain communications. To exercise these rights, contact us at privacy@aneth.io."
          ></Paragraph>
          <Paragraph
            heading="7. Children's Privacy"
            text="ANETH services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children."
          ></Paragraph>
          <Paragraph
            heading="8. Termination of Services"
            text="ANETH reserves the right to terminate or suspend services at any time, with or without cause. Users may also terminate their account at any time by following the provided procedures."
          ></Paragraph>
          <Paragraph
            heading="8. Changes to Privacy Policy"
            text="ANETH reserves the right to update or modify this Privacy Policy. Changes will be effective upon posting the updated policy on our website."
          ></Paragraph>
          <Paragraph
            heading="9. Contact Us"
            text="If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us at privacy@aneth.io."
          ></Paragraph>
          <Heading size="md" fontWeight={500} color="twitter.500">
          By using ANETH services, you acknowledge that you have read, understood, and agree to this Privacy Policy.
          </Heading>
        </Flex>
      </Flex>
    </VStack>
  );
};
