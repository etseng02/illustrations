import React, { Fragment }  from "react";

import './Loading.css'

export default function Waiting(props) {

  return (
    <Fragment>
              <div class="load-wrapp">
              <div class="load-3">
                <h1 id="loading">Please Hold</h1>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
            </div>
        </div>


    </Fragment>
    
  );
}