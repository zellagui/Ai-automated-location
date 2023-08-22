<template>
  <CContainer>
    <h1>AI Automated Audience</h1>
    <br />

    <CContainer>
      <h3>Audience Discovery</h3>
      <p>
        Welcome to a new era of target audience identification. With our unique
        combination of advanced AI technology and comprehensive statistical
        data, we deliver precise, location-specific audience insights for your
        advertising needs. Just provide a brief description of your company and
        ideal customers, and our platform will do the rest. Experience
        unprecedented speed, accuracy, and efficiency in finding your optimal
        audience. Start making smarter advertising decisions today.
      </p>
    </CContainer>
    <CContainer>
      <img
        src="https://quest.mit.edu/sites/default/files/styles/event_image/public/2023-02/logo-80ed4b1996b528146ccfca998cf37b71.png?h=bfced127&itok=H0N74aRz"
        alt="AI Image"
        class="img-fluid"
        style="max-width: 30%"
      />
    </CContainer>
    <br />
    <CAccordion>
      <CAccordionItem :item-key="1">
        <CAccordionHeader> Describe Your Company </CAccordionHeader>
        <CAccordionBody>
          Please provide a brief summary of your company's main offerings,
          target market, and unique selling points. For instance, you might
          mention your flagship products or services, the geographic area you
          serve, and the unique qualities that set you apart from your
          competitors.
        </CAccordionBody>
      </CAccordionItem>
      <CAccordionItem :item-key="2">
        <CAccordionHeader> Identify Your Ideal Customers </CAccordionHeader>
        <CAccordionBody>
          Describe your perfect customer profile. This could include demographic
          information (such as age, gender, income level, or education),
          behaviors (such as shopping habits or lifestyle choices), and
          motivations (such as specific problems they need to solve or goals
          they're trying to achieve). The more detail you provide, the better
          our AI can tailor its results to your needs.
        </CAccordionBody>
      </CAccordionItem>
      <CAccordionItem :item-key="3">
        <CAccordionHeader> Disclaimer </CAccordionHeader>
        <CAccordionBody>
          Please note that the success of our AI analysis is based on the
          accuracy and detail of your inputs. The more specific you are, the
          better our AI can work for you. Keep in mind that while we strive for
          high accuracy, our tool should be used as a guide and complement to,
          not a replacement for, your own judgement and expertise. Our tool does
          not guarantee results, but provides potential insights to inform your
          decision-making process.
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  </CContainer>
</template>

<script lang="ts" setup>
import {
  CContainer,
  CAccordion,
  CAccordionHeader,
  CAccordionBody,
  CAccordionItem,
} from "@coreui/vue";
</script>
