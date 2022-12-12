export class LicenseElement {
  id: string;
}

export class LicenseSummary {
  packageName: string;
  author: string;
  licenses: LicenseElement[];
}

export class BomComponent {
  type: string;
  'bom-ref': string;
  group: string;
  name: string;
  version: string;
  description: string;
  author: string;
  hashes: {
    alg: string;
    content: string;
  }[];
  licenses: {
    expression: string | null;
    license: {
      id: string | null;
      name: string | null;
    };
  }[];
  purl: string;
  externalReferences: {
    type: string;
    url: string;
  }[];
}

export class BomFile {
  bomFormat: string;
  specVersion: string;
  serialNumber: string;
  version: string;
  metadata: {
    timestamp: string;
    tools: {
      vendor: string,
      name: string,
      version: string,
    }[];
    component: BomComponent;
  };
  components: BomComponent[];
}
