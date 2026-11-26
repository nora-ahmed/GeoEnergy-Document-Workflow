using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GeoEnergy.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddApprovedVersionToDocument : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ApprovedVersionId",
                table: "Documents",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Documents_ApprovedVersionId",
                table: "Documents",
                column: "ApprovedVersionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_DocumentVersions_ApprovedVersionId",
                table: "Documents",
                column: "ApprovedVersionId",
                principalTable: "DocumentVersions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Documents_DocumentVersions_ApprovedVersionId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Documents_ApprovedVersionId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "ApprovedVersionId",
                table: "Documents");
        }
    }
}
