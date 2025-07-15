# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of VIES VAT Checker MCP Server
- `check_vat_number` tool for real VAT number validation
- `check_vat_test_service` tool for testing service integration
- `check_vies_status` tool for checking service availability
- `list_eu_member_states` tool for listing supported countries
- Comprehensive error handling with bilingual messages (Slovak/English)
- Support for all 27 EU member states
- TypeScript implementation with strict type checking
- Unit tests with Jest
- Docker support with multi-stage builds
- Complete documentation and examples
- Configuration examples for Claude Desktop and Augment

### Features
- Real-time VAT number validation using official VIES REST API
- Automatic VAT number preprocessing and correction
- Service status monitoring for all EU member states
- Bilingual support (Slovak and English)
- Comprehensive input validation using Zod schemas
- Production-ready error handling and logging
- ESM (ES Modules) support
- Full TypeScript type safety

### Technical Details
- Built with @modelcontextprotocol/sdk v0.4.0
- Uses axios for HTTP requests with proper error handling
- Zod for runtime type validation
- Jest for testing with ESM support
- ESLint for code quality
- Docker containerization support
- Comprehensive CI/CD ready structure
