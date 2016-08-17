/*
 * Copyright (c) 2016 Hewlett Packard Enterprise Development L.P.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See
 * the License for the specific language governing permissions and limitations
 * under the License.
 */

import Keystone from "../../src/keystone";
import config from "./helpers/cloudsConfig";

describe("Keystone", () => {
  let devstackConfig = config.clouds.devstack;
  let keystone = new Keystone(devstackConfig);

  describe("versions()", () => {
    it("should return a list of all versions available on this clouds' keystone", (done) => {
      keystone.versions()
        .then((versions) => {
          // Quick sanity check.
          expect(versions.length > 0).toBeTruthy();
          done();
        })
        .catch((error) => done.fail(error));
    });
  });

  describe("version()", () => {

    const supportedApiVersions = [
      new Version('identity 3.7')
    ];

    /**
     * This test acts as a canary, to inform the SDK developers that the Keystone API
     * has changed in a significant way.
     */
    it("should return a supported version.", (done) => {
      keystone.version()
        .then((version) => {

          // Quick sanity check.
          const apiVersion = new Version('identity', version.id);

          for (let i = 0; i < supportedApiVersions.length; i++) {
            let supportedVersion = supportedApiVersions[i];
            if (apiVersion.equals(supportedVersion)) {
              done();
              return;
            }
          }
          fail("Current devstack keystone version is not supported.");
          done();
        })
        .catch((error) => done.fail(error));
    });
  });
});
