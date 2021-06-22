<template>
  <div class="basic-container info-container">
    <Tree />
    <Relation class="relation-wrapper" />
    <PropertyDetail />
  </div>
</template>
<script>
import Relation from "./components/Relation";
import Tree from "./components/Tree";
import PropertyDetail from "./components/PropertyDetail";
export default {
  name: "Info",

  components: { Relation, Tree, PropertyDetail },

  data() {
    return {
      toolForm: {
        bt: "",
        checked: false
      }  
    };
  },
  methods: {
    edit() {},
    treeLoad() {
      let trees = [
        {
          label: "DomainObjectsssssssss",
          id: 1,
          children: [
            {
              label: "Vulnerability",
              children: [
                {
                  id: 2,
                  label: "CWE"
                }
              ]
            },
            {
              label: "ExploitTargetObject",
              children: [
                {
                  label: "CVE"
                }
              ]
            },

            {
              label: "Malware"
            },
            {
              label: "Host"
            },
            {
              label: "MalwareCharacteristics",
              children: [
                {
                  label: "Obfuscation"
                },
                {
                  label: "Payload"
                },
                {
                  label: "Vector"
                }
              ]
            },
            {
              label: "Tactic"
            },
            {
              label: "Software"
            },
            {
              label: "SubTechnique"
            },
            {
              label: "Technique"
            },
            {
              label: "Account"
            },
            {
              label: "Attacker"
            },
            {
              label: "AttackerGroup"
            },
            {
              label: "Campaign"
            },
            {
              label: "Indicator",
              children: [
                {
                  label: "Address"
                },
                {
                  label: "Email"
                },
                {
                  label: "File"
                },
                {
                  label: "Hash",
                  children: [
                    {
                      label: "AuthenticationHash"
                    },
                    {
                      label: "MD5"
                    },
                    {
                      label: "SHA",
                      children: [
                        {
                          label: "SHA-1"
                        },
                        {
                          label: "SHA-256"
                        }
                      ]
                    },
                    {
                      label: "SSDeep"
                    },
                    {
                      label: "vHash"
                    }
                  ]
                }
              ]
            },
            {
              label: "Location",
              children: [
                {
                  label: "Region",
                  children: [
                    {
                      label: "Country",
                      children: [
                        {
                          label: "Locality"
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              label: "MalwareFamily"
            },
            {
              label: "Organization"
            },
            {
              label: "Person"
            },

            {
              label: "System"
            },

            {
              label: "User"
            }
          ]
        },
        {
          label: "Observable",
          children: [
            {
              label: "Crond"
            },
            {
              label: "DomainName"
            },
            {
              label: "HostService"
            },
            {
              label: "IPv4Address"
            },
            {
              label: "IPv6Address"
            },
            {
              label: "LoginAudit"
            },
            {
              label: "MacAddress"
            },
            {
              label: "NetworkTraffic"
            },
            {
              label: "Regedit"
            },
            {
              label: "URL"
            }
          ]
        }
      ];
      return trees;
    }
  }
};
</script>
<style lang="scss">
.tool-box {
  height: 50px;
}
.relation-wrapper {
  flex: 1;
}
.info-container {
  display: flex;
  overflow: hidden;
  height: calc(100vh - 110px);
  .info-left {
    min-width: 232px;
    margin-right: 0 !important;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
  .tree-wrapper {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
