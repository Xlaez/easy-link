package libs

import (
	"context"
	"log"
	"time"

	"github.com/Xlaez/easy-link/utils"
	"github.com/cloudinary/cloudinary-go"
	"github.com/cloudinary/cloudinary-go/api/uploader"
	"github.com/gin-gonic/gin"
)

func InitCloud() *cloudinary.Cloudinary {
	config, err := utils.LoadConfig("../")

	if err != nil {
		log.Fatal("Error: cannot load config", err)
	}

	cld, _ := cloudinary.NewFromURL(config.CloudinaryEnv)
	return cld
}

func UploadToCloud(ctx *gin.Context) (string, string, error) {
	fileNm := ctx.PostForm("connect-upload" + time.Now().String())
	fileTags := ctx.PostForm("tags")

	file, _, err := ctx.Request.FormFile("upload")

	if err != nil {
		return "", "", err
	}

	res, err := InitCloud().Upload.Upload(ctx, file, uploader.UploadParams{
		PublicID:    fileNm,
		AutoTagging: ctx.GetFloat64(fileTags),
	})

	if err != nil {
		return "", "", err
	}
	return res.SecureURL, res.PublicID, nil
}

func DeleteFromCloud(publicId string, ctx context.Context) error {
	_, err := InitCloud().Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicId,
	})
	if err != nil {
		return err
	}
	return nil
}
