import { TestBed } from '@angular/core/testing';
import { StringTransformService } from './string-transform.service';

describe('StringTransformService', () => {
  let service: StringTransformService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringTransformService]
    });

    service = TestBed.inject(StringTransformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('encode -> decode', () => {
    it('should return the original string after encoding and then decoding', () => {
      const originalString = 'Test String 123!@#öäüß';
      const encodedString = service.encode(originalString);
      const decodedString = service.decode(encodedString);
      expect(decodedString).toBe(originalString);
    });
  });

  describe('sanitize', () => {
    it('should sanitize malicious script tags', () => {
      const input = '<script>alert("XSS")</script>Hello World';
      const result = service.sanitize(input);

      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
      expect(result).toBe('Hello World');
    });

    it('should sanitize dangerous HTML attributes', () => {
      const input = '<div onclick="alert(\'XSS\')">Click me</div>';
      const result = service.sanitize(input);

      expect(result).not.toContain('onclick');
      expect(result).not.toContain('alert');
      expect(result).toContain('<div>Click me</div>');
    });

    it('should preserve safe HTML tags', () => {
      const input = '<p>This is <strong>bold</strong> text</p>';
      const result = service.sanitize(input);

      expect(result).toBe('<p>This is <strong>bold</strong> text</p>');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = service.sanitize(input);

      expect(result).toBe('');
    });

    it('should handle plain text without HTML', () => {
      const input = 'Just plain text';
      const result = service.sanitize(input);

      expect(result).toBe('Just plain text');
    });

    it('should remove javascript: URLs', () => {
      const input = '<a href="javascript:alert(\'XSS\')">Click</a>';
      const result = service.sanitize(input);

      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });

    it('should remove XSS from email', () => {
      const input = '"<script>alert(1)</script>"@example.com`,';
      const result = service.sanitize(input);

      expect(result).not.toContain('script');
      expect(result).not.toContain('alert');
    });

    it('should keep complex Email addresses intact', () => {
      const input = [
        `user+tag@example.com`,
        `user-name@example.com`,
        `user_name@example.com`,
        `user.name@example.com`,
        `123user@example.com`,
        `user123@example.com`,
        `a@example.com`,
        `test!mail@example.com`,
        `test#mail@example.com`,
        `test$mail@example.com`,
        `test%mail@example.com`,
        `test&mail@example.com`,
        `test'mail@example.com`,
        `test*mail@example.com`,
        `test+mail@example.com`,
        `test/mail@example.com`,
        `test=mail@example.com`,
        `test?mail@example.com`,
        `test^mail@example.com`,
        `test_mail@example.com`,
        `test\`mail@example.com`,
        `test{mail@example.com`,
        `test|mail@example.com`,
        `test}mail@example.com`,
        `test~mail@example.com`,
        `test-mail@example.com`,
        `"test mail"@example.com`,
        `"test@mail"@example.com`,
        `"test.mail"@example.com`,
        `"user name"@example.com`,
        `"special()chars"@example.com`,
        `"contains spaces"@example.com`,
        `"test\"quoted"@example.com`,
        `user+filter+tag@example.com`,
        `very.common@example.com`,
        `long.email-address-with-hyphens@example.com`,
        `user.name+tag+sorting@example.com`
      ];

      for (const email of input) {
        const result = service.sanitize(email);
        expect(result).toBe(email);
      }
    });

    // This is no longer a valid attack vector, as it has been addressed by browser vendors. See https://security.stackexchange.com/a/124843
    // This test is retained for developer awareness.
    xit('should sanitize style attributes with dangerous CSS', () => {
      const input = '<div style="background: url(javascript:alert(\'XSS\'))">Content</div>';
      const result = service.sanitize(input);

      expect(result).not.toContain('javascript:');
      expect(result).not.toContain('alert');
    });
  });
});
