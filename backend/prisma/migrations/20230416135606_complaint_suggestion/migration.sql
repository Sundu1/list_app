/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Post];

-- CreateTable
CREATE TABLE [dbo].[Complaint_and_suggestion_list] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ComplaintSuggestion] NVARCHAR(1000),
    [ComplaintType] NVARCHAR(1000),
    [ComplaintReason] NVARCHAR(1000),
    [ComplaintResolution] NVARCHAR(1000),
    [ComplaintResolution_date] DATETIME2,
    [ResponsibleEmployee] NVARCHAR(1000),
    [Location] NVARCHAR(1000),
    [CreatedAt] DATETIME2 NOT NULL CONSTRAINT [Complaint_and_suggestion_list_CreatedAt_df] DEFAULT CURRENT_TIMESTAMP,
    [CreatedBy] NVARCHAR(1000),
    [ComplaintDate] DATETIME2,
    [ModifiedAt] DATETIME2,
    [ModifiedBy] NVARCHAR(1000),
    CONSTRAINT [Complaint_and_suggestion_list_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
