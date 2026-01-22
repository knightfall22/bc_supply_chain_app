/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/scm_program.json`.
 */
export type ScmProgram = {
  address: "G6jHWjRMTx4Gz98hY1UysdzAvuysutDxVYkvbiKxe2Ak";
  metadata: {
    name: "scmProgram";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "acceptTransfer";
      discriminator: [94, 249, 171, 62, 208, 120, 49, 110];
      accounts: [
        {
          name: "asset";
          writable: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "product";
          writable: true;
        },
        {
          name: "custodian";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.organization";
                account: "product";
              },
              {
                kind: "account";
                path: "product.custodian.custodian_wallet";
                account: "product";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.organization";
                account: "product";
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.product_id";
                account: "product";
              },
              {
                kind: "account";
                path: "product.event_index_count";
                account: "product";
              },
            ];
          };
        },
        {
          name: "mplCoreProgram";
          address: "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "createProduct";
      discriminator: [183, 155, 202, 119, 43, 114, 174, 225];
      accounts: [
        {
          name: "asset";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "product";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  114,
                  111,
                  100,
                  117,
                  99,
                  116,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "organization";
              },
              {
                kind: "arg";
                path: "productId";
              },
            ];
          };
        },
        {
          name: "participant";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "organization";
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "arg";
                path: "productId";
              },
              {
                kind: "const";
                value: [0, 0, 0, 0, 0, 0, 0, 0];
              },
            ];
          };
        },
        {
          name: "mplCoreProgram";
          address: "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "productId";
          type: {
            array: ["u8", 16];
          };
        },
        {
          name: "batchNumber";
          type: {
            array: ["u8", 16];
          };
        },
        {
          name: "name";
          type: "string";
        },
        {
          name: "quantity";
          type: "u64";
        },
        {
          name: "assetArgs";
          type: {
            defined: {
              name: "createProductAssetArgs";
            };
          };
        },
      ];
    },
    {
      name: "createSeal";
      discriminator: [80, 54, 107, 63, 40, 203, 236, 97];
      accounts: [
        {
          name: "asset";
          writable: true;
          signer: true;
        },
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "product";
          writable: true;
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "organization";
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.product_id";
                account: "product";
              },
              {
                kind: "account";
                path: "product.event_index_count";
                account: "product";
              },
            ];
          };
        },
        {
          name: "mplCoreProgram";
          address: "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "args";
          type: {
            defined: {
              name: "createAssetArgs";
            };
          };
        },
      ];
    },
    {
      name: "initiateTransfer";
      discriminator: [128, 229, 77, 5, 65, 234, 228, 75];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "product";
          writable: true;
        },
        {
          name: "participant";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.organization";
                account: "product";
              },
              {
                kind: "arg";
                path: "address";
              },
            ];
          };
        },
        {
          name: "custodian";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.organization";
                account: "product";
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "event";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  101,
                  118,
                  101,
                  110,
                  116,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "product.product_id";
                account: "product";
              },
              {
                kind: "account";
                path: "product.event_index_count";
                account: "product";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "address";
          type: "pubkey";
        },
      ];
    },
    {
      name: "registerOrganization";
      discriminator: [183, 29, 228, 76, 94, 9, 196, 137];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "organization";
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
      ];
    },
    {
      name: "registerParticipants";
      discriminator: [183, 56, 72, 238, 129, 113, 206, 27];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  97,
                  114,
                  116,
                  105,
                  99,
                  105,
                  112,
                  97,
                  110,
                  116,
                  115,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "organization";
              },
              {
                kind: "arg";
                path: "address";
              },
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "address";
          type: "pubkey";
        },
        {
          name: "name";
          type: "string";
        },
        {
          name: "role";
          type: {
            defined: {
              name: "role";
            };
          };
        },
      ];
    },
    {
      name: "toggleVerification";
      discriminator: [25, 242, 227, 1, 254, 140, 16, 43];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [];
    },
    {
      name: "updateName";
      discriminator: [70, 146, 141, 213, 58, 44, 119, 169];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
      ];
    },
    {
      name: "updateRole";
      discriminator: [36, 223, 162, 98, 168, 209, 75, 151];
      accounts: [
        {
          name: "authority";
          writable: true;
          signer: true;
          relations: ["organization"];
        },
        {
          name: "organization";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  111,
                  114,
                  103,
                  97,
                  110,
                  105,
                  122,
                  97,
                  116,
                  105,
                  111,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116,
                ];
              },
              {
                kind: "account";
                path: "authority";
              },
            ];
          };
        },
        {
          name: "participant";
          writable: true;
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
      ];
      args: [
        {
          name: "role";
          type: {
            defined: {
              name: "role";
            };
          };
        },
      ];
    },
  ];
  accounts: [
    {
      name: "event";
      discriminator: [125, 192, 125, 158, 9, 115, 152, 233];
    },
    {
      name: "organization";
      discriminator: [145, 38, 152, 251, 91, 57, 118, 160];
    },
    {
      name: "participant";
      discriminator: [32, 142, 108, 79, 247, 179, 54, 6];
    },
    {
      name: "product";
      discriminator: [102, 76, 55, 251, 38, 73, 224, 229];
    },
  ];
  errors: [
    {
      code: 6000;
      name: "notCurrentCustodian";
      msg: "not current custodian";
    },
    {
      code: 6001;
      name: "invalidCustodianTransfer";
      msg: "invalid transfer";
    },
    {
      code: 6002;
      name: "notPendingCustodian";
      msg: "cannot sign for this product";
    },
    {
      code: 6003;
      name: "noPendingCustodian";
      msg: "no custodian is pending";
    },
    {
      code: 6004;
      name: "notAuthenticated";
      msg: "product is not authenticated";
    },
  ];
  types: [
    {
      name: "createAssetArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
        ];
      };
    },
    {
      name: "createProductAssetArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
        ];
      };
    },
    {
      name: "custodesInformation";
      type: {
        kind: "struct";
        fields: [
          {
            name: "participant";
            type: "pubkey";
          },
          {
            name: "role";
            type: {
              defined: {
                name: "role";
              };
            };
          },
          {
            name: "custodianWallet";
            type: "pubkey";
          },
        ];
      };
    },
    {
      name: "event";
      type: {
        kind: "struct";
        fields: [
          {
            name: "producer";
            type: "pubkey";
          },
          {
            name: "eventIndex";
            type: "u64";
          },
          {
            name: "timestamp";
            type: "i64";
          },
          {
            name: "eventType";
            type: {
              defined: {
                name: "eventType";
              };
            };
          },
          {
            name: "product";
            type: "pubkey";
          },
          {
            name: "destination";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "eventType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "created";
          },
          {
            name: "authenticated";
          },
          {
            name: "custodyTransferred";
          },
          {
            name: "custodyReceived";
          },
          {
            name: "checkPointScan";
          },
          {
            name: "productDelivered";
          },
        ];
      };
    },
    {
      name: "organization";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "authority";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "participant";
      type: {
        kind: "struct";
        fields: [
          {
            name: "organization";
            type: "pubkey";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "address";
            type: "pubkey";
          },
          {
            name: "role";
            type: {
              defined: {
                name: "role";
              };
            };
          },
          {
            name: "verified";
            type: "bool";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "product";
      type: {
        kind: "struct";
        fields: [
          {
            name: "organization";
            type: "pubkey";
          },
          {
            name: "manufacturer";
            type: "pubkey";
          },
          {
            name: "productId";
            type: {
              array: ["u8", 16];
            };
          },
          {
            name: "batchNumber";
            type: {
              array: ["u8", 16];
            };
          },
          {
            name: "quantity";
            type: "u64";
          },
          {
            name: "createdAt";
            type: "i64";
          },
          {
            name: "eventIndexCount";
            type: "u64";
          },
          {
            name: "state";
            type: {
              defined: {
                name: "productState";
              };
            };
          },
          {
            name: "pendingCustodian";
            type: {
              option: "pubkey";
            };
          },
          {
            name: "custodian";
            type: {
              defined: {
                name: "custodesInformation";
              };
            };
          },
          {
            name: "authenticated";
            type: "bool";
          },
          {
            name: "name";
            type: "string";
          },
          {
            name: "asset";
            type: "pubkey";
          },
          {
            name: "bump";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "productState";
      type: {
        kind: "enum";
        variants: [
          {
            name: "created";
          },
          {
            name: "arrived";
          },
          {
            name: "inTransit";
          },
          {
            name: "delivered";
          },
        ];
      };
    },
    {
      name: "role";
      type: {
        kind: "enum";
        variants: [
          {
            name: "manufacturer";
          },
          {
            name: "distributor";
          },
          {
            name: "retailer";
          },
        ];
      };
    },
  ];
  constants: [
    {
      name: "eventAccount";
      type: "string";
      value: '"event_account"';
    },
    {
      name: "organizationAccount";
      type: "string";
      value: '"organization_account"';
    },
    {
      name: "participantsAccount";
      type: "string";
      value: '"participants_account"';
    },
    {
      name: "productAccount";
      type: "string";
      value: '"product_account"';
    },
    {
      name: "seed";
      type: "string";
      value: '"anchor"';
    },
  ];
};
