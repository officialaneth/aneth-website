import { filter } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";
export const TokenomicsTSX = ({
  onClickIO,
  onClickCommunity,
  onClickEcosystem,
  onClickExchangeListing,
  onClickRewards,
  onClickMetaverse,
  onClickWeb3,
  onClickDeveloper,
  onClickFuture,
  onClickPublic,
}: {
  onClickIO?: () => void;
  onClickCommunity?: () => void;
  onClickEcosystem?: () => void;
  onClickExchangeListing?: () => void;
  onClickRewards?: () => void;
  onClickMetaverse?: () => void;
  onClickWeb3?: () => void;
  onClickDeveloper?: () => void;
  onClickFuture?: () => void;
  onClickPublic?: () => void;
}) => {
  const motionConfigWhileHover = {
    scale: 1.05,
    fillOpacity: 1,
  };

  return (
    <svg
      width={702}
      height={702}
      viewBox="0 0 702 702"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 1">
        <motion.path
          id="internal-circle"
          d="M597 351.5C597 487.638 486.638 598 350.5 598C214.362 598 104 487.638 104 351.5C104 215.362 214.362 105 350.5 105C486.638 105 597 215.362 597 351.5ZM110.492 351.5C110.492 484.053 217.947 591.508 350.5 591.508C483.053 591.508 590.508 484.053 590.508 351.5C590.508 218.947 483.053 111.492 350.5 111.492C217.947 111.492 110.492 218.947 110.492 351.5Z"
          fill="#373737"
          fillOpacity={0.1}
        />
        <motion.path
          id="external-circle"
          d="M651 351.5C651 517.462 516.461 652 350.5 652C184.538 652 49.9998 517.462 49.9998 351.5C49.9998 185.538 184.538 51.0001 350.5 51.0001C516.461 51.0001 651 185.538 651 351.5ZM53.0048 351.5C53.0048 515.802 186.198 648.995 350.5 648.995C514.802 648.995 647.995 515.802 647.995 351.5C647.995 187.198 514.802 54.0051 350.5 54.0051C186.198 54.0051 53.0048 187.198 53.0048 351.5Z"
          fill="#373737"
          fillOpacity={0.1}
        />
        <motion.path
          id="2.38_initial_offereing"
          d="M351 67.0001C365.163 67.0001 379.306 68.0596 393.311 70.1696L389.08 98.2527C376.475 96.3536 363.747 95.4001 351 95.4001L351 67.0001Z"
          fill="#15A89F"
          whileHover={motionConfigWhileHover}
          onClick={onClickIO}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #15A89F)"
        />
        <motion.path
          id="4.76_community"
          d="M397.358 70.8093C425.343 75.4395 452.477 84.2362 477.856 96.9065L465.17 122.316C442.329 110.913 417.909 102.996 392.722 98.8284L397.358 70.8093Z"
          fill="#DEA922"
          whileHover={motionConfigWhileHover}
          onClick={onClickCommunity}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #DEA922)"
        />
        <motion.path
          id="4.76_ecosystem"
          d="M480.357 98.1706C505.609 111.091 528.784 127.721 549.108 147.508L529.297 167.857C511.005 150.049 490.148 135.082 467.421 123.454L480.357 98.1706Z"
          fill="#16E744"
          whileHover={motionConfigWhileHover}
          onClick={onClickEcosystem}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #16E744)"
        />
        <motion.path
          id="4.76_exchange_listing"
          d="M551.818 150.182C571.876 170.239 588.815 193.189 602.073 218.266L576.965 231.539C565.034 208.97 549.788 188.315 531.736 170.264L551.818 150.182Z"
          fill="#226DDE"
          whileHover={motionConfigWhileHover}
          onClick={onClickExchangeListing}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #226DDE)"
        />
        <motion.path
          id="1.90_rewards"
          d="M603.877 221.736C609.022 231.802 613.562 242.166 617.472 252.773L590.825 262.596C587.306 253.05 583.22 243.722 578.589 234.663L603.877 221.736Z"
          fill="#22DEDE"
          whileHover={motionConfigWhileHover}
          onClick={onClickRewards}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #22DEDE)"
        />
        <motion.path
          id="10_metavese"
          d="M619.248 257.731C638.944 314.379 640.201 375.809 622.839 433.216L595.655 424.994C611.281 373.328 610.15 318.041 592.423 267.058L619.248 257.731Z"
          fill="#5E22DE"
          whileHover={motionConfigWhileHover}
          onClick={onClickMetaverse}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #5E22DE)"
        />
        <g id="14.77_web3">
          <mask id="motion.path-9-inside-1_15_41" fill="white">
            <motion.path d="M621.291 438.171C607.747 480.166 584.604 518.427 553.698 549.92C522.792 581.413 484.973 605.272 443.241 619.603L434.017 592.743C471.576 579.845 505.613 558.372 533.429 530.028C561.244 501.685 582.072 467.249 594.262 429.454L621.291 438.171Z" />
          </mask>
          <motion.path
            d="M621.291 438.171C607.747 480.166 584.604 518.427 553.698 549.92C522.792 581.413 484.973 605.272 443.241 619.603L434.017 592.743C471.576 579.845 505.613 558.372 533.429 530.028C561.244 501.685 582.072 467.249 594.262 429.454L621.291 438.171Z"
            fill="#AD22DE"
            mask="url(#motion.path-9-inside-1_15_41)"
            whileHover={motionConfigWhileHover}
            onClick={onClickWeb3}
            fillOpacity={0.5}
            filter="drop-shadow(0px 0px 1px #AD22DE)"
          />
        </g>
        <motion.path
          id="5.23_developer"
          d="M438.9 621.055C409.253 630.705 378.218 635.407 347.043 634.973L347.439 606.575C375.497 606.966 403.428 602.734 430.11 594.049L438.9 621.055Z"
          fill="#DE5B22"
          whileHover={motionConfigWhileHover}
          onClick={onClickDeveloper}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #DE5B22)"
        />
        <motion.path
          id="10_future_development"
          d="M342.642 634.877C282.693 633.112 224.841 612.414 177.379 575.749L194.741 553.274C237.457 586.272 289.523 604.901 343.477 606.489L342.642 634.877Z"
          fill="#2235DE"
          whileHover={motionConfigWhileHover}
          onClick={onClickFuture}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #2235DE)"
        />
        <motion.path
          id="41.44_public"
          d="M173.742 572.892C128.108 536.437 94.824 486.799 78.4245 430.742C62.0249 374.684 63.3079 314.933 82.0986 259.632C100.889 204.33 136.274 156.166 183.431 121.704C230.587 87.2421 287.223 68.1576 345.619 67.051L346.157 95.4459C293.6 96.4418 242.629 113.618 200.188 144.634C157.746 175.65 125.9 218.997 108.989 268.768C92.0771 318.54 90.9224 372.316 105.682 422.767C120.442 473.219 150.398 517.893 191.468 550.702L173.742 572.892Z"
          fill="#828282"
          whileHover={motionConfigWhileHover}
          onClick={onClickPublic}
          fillOpacity={0.5}
          filter="drop-shadow(0px 0px 1px #373737)"
        />
      </g>
    </svg>
  );
};
