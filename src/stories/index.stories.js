import React, { Fragment } from 'react'

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import '../index.css'

import Loading from '../components/Loading'

storiesOf("Loading", module)
  .addParameters({
    backgrounds: [{ name: "dark", value: "#222f3e", default: true }]
  })
  .add("Loading", () => <Loading></Loading>)