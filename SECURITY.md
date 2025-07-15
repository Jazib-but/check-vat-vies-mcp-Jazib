# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@augmentcode.com]**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Considerations

### Data Handling
- This MCP server does not store any VAT numbers or validation results
- All requests are made directly to the official EU VIES service over HTTPS
- No sensitive data is logged or persisted

### Network Security
- All communications with VIES API use HTTPS
- No authentication credentials are required or stored
- Rate limiting should be implemented at the application level

### Input Validation
- All inputs are validated using Zod schemas
- Country codes are restricted to valid EU member states
- VAT numbers are length-limited and sanitized

### Dependencies
- Regular dependency updates are recommended
- All dependencies are from trusted sources
- No known security vulnerabilities in current dependencies

### Deployment Security
- Run with non-root user (Docker configuration included)
- Use read-only filesystem when possible
- Implement proper logging and monitoring
- Consider rate limiting for production deployments

## Best Practices

1. **Keep Dependencies Updated**: Regularly update all dependencies
2. **Monitor for Vulnerabilities**: Use tools like `npm audit` to check for known vulnerabilities
3. **Secure Deployment**: Follow container security best practices
4. **Rate Limiting**: Implement rate limiting to prevent abuse of the VIES service
5. **Monitoring**: Monitor for unusual patterns or errors
6. **Access Control**: Restrict access to the MCP server appropriately

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under support
4. Release new versions as soon as possible

## Comments on this Policy

If you have suggestions on how this process could be improved please submit a pull request.
