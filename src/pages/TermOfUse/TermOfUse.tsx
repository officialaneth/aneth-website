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

export const TermOfUse = () => {
  return (
    <VStack>
      <Flex maxW={1000} direction="column" gap={10}>
        <Heading color="twitter.500">ANETH - Terms of Service</Heading>{' '}
        <Flex maxW={1000} direction="column" gap={5}>
          <Paragraph
            heading="1. Acceptance of Terms"
            text="By accessing or using any services provided by ANETH, including but not limited to the website, decentralized applications, and associated platforms, you agree to abide by these Terms of Service. If you do not agree with any part of these terms, you may not access or use our services."
          ></Paragraph>
          <Paragraph
            heading="2. Eligibility"
            text="You agree to use ANETH services in compliance with all applicable laws and regulations. You are solely responsible for your conduct and any data, text, information, graphics, photos, profiles, audio, and video clips uploaded, transmitted, or shared through your account."
          ></Paragraph>
          <Paragraph
            heading="3. Account Registration"
            text="You must be at least 18 years old or the legal age in your jurisdiction to use ANETH services. By accessing our platform, you confirm that you meet the eligibility requirements."
          ></Paragraph>
          <Paragraph
            heading="4. User Conduct"
            text="You must be at least 18 years old or the legal age in your jurisdiction to use ANETH services. By accessing our platform, you confirm that you meet the eligibility requirements."
          ></Paragraph>
          <Paragraph
            heading="5. Prohibited Activities"
            text={
              <Text>
                You agree not to engage in any of the following prohibited
                activities:
                <UnorderedList>
                  <ListItem>
                    Violating any laws, regulations, or third-party rights.
                  </ListItem>
                  <ListItem>
                    Using ANETH for any fraudulent or illegal purposes.
                  </ListItem>
                  <ListItem>
                    Attempting to gain unauthorized access to any part of ANETH.
                  </ListItem>
                  <ListItem>
                    Interfering with or disrupting the integrity or performance
                    of ANETH.
                  </ListItem>
                  <ListItem>
                    Engaging in any form of market manipulation.
                  </ListItem>
                </UnorderedList>
              </Text>
            }
          ></Paragraph>
          <Paragraph
            heading="6. Risks and Disclaimers"
            text="Participating in cryptocurrency-related activities involves inherent risks. ANETH does not guarantee the accuracy, completeness, or reliability of any information on the platform. Users are responsible for conducting their own research and due diligence."
          ></Paragraph>
          <Paragraph
            heading="7. Intellectual Property"
            text="ANETH and its associated logos, trademarks, and content are the intellectual property of ANETH. Users agree not to reproduce, distribute, or create derivative works without prior written consent."
          ></Paragraph>
          <Paragraph
            heading="8. Termination of Services"
            text="ANETH reserves the right to terminate or suspend services at any time, with or without cause. Users may also terminate their account at any time by following the provided procedures."
          ></Paragraph>
          <Paragraph
            heading="9. Amendments"
            text="ANETH reserves the right to modify or update these Terms of Service at any time. Users will be notified of any significant changes, and continued use of the services after such modifications constitutes acceptance of the revised terms."
          ></Paragraph>
          <Paragraph
            heading="10. Governing Law"
            text="These Terms of Service shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles."
          ></Paragraph>
          <Heading size="md" fontWeight={500} color="twitter.500">
            By using ANETH services, you acknowledge that you have read,
            understood, and agree to these Terms of Service. If you have any
            questions or concerns, please contact us at legal@aneth.io.
          </Heading>
        </Flex>
      </Flex>
    </VStack>
  );
};
