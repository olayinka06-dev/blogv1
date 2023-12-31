import React from "react";
import { HiOutlineStatusOffline } from "react-icons/hi";
import {GoCloudOffline} from "react-icons/go"

export const NetworkError = ({text}) => {
  return (
    <div className="mx-auto text-center">
      <p>
        {
          text
        }
        {/* Could not load posts please check your internet connection and try again */}
      </p>
      <span className="text-[40px] ">
        <GoCloudOffline className="text-center mx-auto" />
      </span>
    </div>
  );
};
