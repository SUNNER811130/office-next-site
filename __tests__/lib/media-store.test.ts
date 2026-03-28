import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { uploadAsset, deleteAsset, listAssets, isBlobConfigured } from "@/lib/media-store";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn().mockResolvedValue({ Contents: [] })
    })),
    PutObjectCommand: jest.fn(),
    DeleteObjectCommand: jest.fn(),
    ListObjectsV2Command: jest.fn(),
  };
});

describe("Media Store", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Fallback Adapter", () => {
    it("should say blob is not configured when env vars missing", () => {
      delete process.env.R2_ACCOUNT_ID;
      expect(isBlobConfigured()).toBe(false);
    });

    it("should throw on uploadAsset", async () => {
      delete process.env.R2_ACCOUNT_ID;
      
      // Mock File
      global.File = class MockFile {
        name: string;
        type: string;
        size: number;
        constructor(parts: any[], name: string, options?: any) {
          this.name = name;
          this.type = options?.type || "";
          this.size = parts[0].length;
        }
        async arrayBuffer() {
          return new ArrayBuffer(0);
        }
      } as any;

      const file = new File(["dummy content"], "test.png", { type: "image/png" });
      await expect(uploadAsset(file)).rejects.toThrow("R2 is not configured");
    });
    
    it("should list fallback assets", async () => {
      delete process.env.R2_ACCOUNT_ID;
      const assets = await listAssets();
      expect(assets.length).toBeGreaterThan(0);
      expect(assets[0].source).toBe("fallback");
    });
  });

  describe("S3 Adapter", () => {
    beforeEach(() => {
      process.env.R2_ACCOUNT_ID = "test-account";
      process.env.R2_ACCESS_KEY_ID = "test-key";
      process.env.R2_SECRET_ACCESS_KEY = "test-secret";
      process.env.R2_BUCKET_NAME = "test-bucket";
      process.env.R2_PUBLIC_DOMAIN = "https://test.r2.cloudflarestorage.com";
    });

    it("should say blob is configured", () => {
      expect(isBlobConfigured()).toBe(true);
    });

    it("should upload asset to S3", async () => {
      global.File = class MockFile {
        name: string;
        type: string;
        size: number;
        constructor(parts: any[], name: string, options?: any) {
          this.name = name;
          this.type = options?.type || "";
          this.size = parts[0].length;
        }
        async arrayBuffer() {
          return new ArrayBuffer(0);
        }
      } as any;

      const file = new File(["dummy"], "test.png", { type: "image/png" });
      const asset = await uploadAsset(file);

      expect(asset.category).toBe("sections");
      expect(asset.source).toBe("s3");
      expect(asset.url).toContain("https://test.r2.cloudflarestorage.com/sections/test");
    });
  });
});
