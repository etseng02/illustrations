import React, { Fragment, useState }  from "react";

import Button from './Button'
import './Loading.css'

export default function Waiting(props) {

  return (
    <Fragment>
              <div class="load-wrapp">
              <div class="load-3">
                <p>Loading 3</p>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>


    </Fragment>
    
  );
}